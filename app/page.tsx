'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetchMetadata } from 'frames.js/next'
import type { Metadata } from 'next'
import Link from 'next/link'
import { createExampleURL } from './utils'
import { Frame } from './components/Frame'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'
import FrameService from './db/frame'
import { useState } from 'react'

const formSchema = z.object({
	label: z.string().min(5).max(200),
	optionA: z.string().min(1),
	optionB: z.string().min(1),
	expiration: z.date(),
})

// This is a react server component only
export default function Home() {

	const [frameId, setFrameId] = useState<string | null>(null)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			label: 'There will be over 10,000 Kramer predictions before 9/29 midnight?',
			optionA: 'Yes',
			optionB: 'No',
			expiration: new Date(),
		},
	})

	async function onSubmit(data: z.infer<typeof formSchema>) {
		const frame = await FrameService.createFrame({
			label: data.label,
			optionA: data.optionA,
			optionB: data.optionB,
			expiration: data.expiration.getTime(),
		})

		if (frame) {
			setFrameId(frame.id)
		}
	}

	return (
		<div className="flex flex-col max-w-[600px] w-full gap-4 mx-auto p-2 justify-center">
			<h1 className="mt-24 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
				Create a new frame
			</h1>
			<Form {...form}>
				<FormField
					name="label"
					control={form.control}
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Condition</FormLabel>
								<FormControl>
									<Input {...field} placeholder="Label" />
								</FormControl>
							</FormItem>
						)
					}}
				/>
				<div className="grid grid-cols-2 gap-2 justify-between">
					<FormField
						name="optionA"
						control={form.control}
						render={({ field }) => {
							return (
								<FormItem>
									<FormLabel>Option A</FormLabel>
									<FormControl>
										<Input {...field} placeholder="Yes" />
									</FormControl>
								</FormItem>
							)
						}}
					/>
					<FormField
						name="optionB"
						control={form.control}
						render={({ field }) => {
							return (
								<FormItem>
									<FormLabel>Option B</FormLabel>
									<FormControl>
										<Input {...field} placeholder="No" />
									</FormControl>
								</FormItem>
							)
						}}
					/>
				</div>
				<FormField
					name="expiration"
					control={form.control}
					render={({ field }) => {
						return (
							<FormItem className="flex flex-col w-full">
								<FormLabel>Contest Expiration</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant={'outline'}
												className={cn(
													'w-full pl-3 text-left font-normal',
													!field.value &&
														'text-muted-foreground'
												)}
											>
												{field.value ? (
													field.value.toLocaleDateString()
												) : (
													<span>Pick a date</span>
												)}
												<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent
										className="w-auto p-0"
										align="start"
									>
										<Calendar
											mode="single"
											selected={field.value}
											onSelect={field.onChange}
											disabled={(date: Date) =>
												date < new Date()
											}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
								<FormDescription>
									This is when the contest will be closed.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)
					}}
				/>
				<Button onClick={form.handleSubmit(onSubmit)}>
					Create Frame
				</Button>
			</Form>
			{
				frameId && (
					<Link href={`/frames/${frameId}`}>
						<a>View Frame</a>
					</Link>
				)
			}
		</div>
	)
}
