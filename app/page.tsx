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

const formSchema = z.object({
	label: z.string(),
	optionA: z.string(),
	optionB: z.string(),
	expiration: z.date(),
})

// This is a react server component only
export default function Home() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			label: 'There will be over 10,000 Kramer predictions before 9/29 midnight?',
			optionA: 'Yes',
			optionB: 'No',
			expiration: new Date(),
		},
	})

	function onSubmit(data: z.infer<typeof formSchema>) {
		console.log(data)
	}

	return (
		<div className="flex flex-col max-w-[600px] w-full gap-2 mx-auto p-2">
			<div className="pb-4">Create a new frame</div>
			<Form {...form}>
				<FormField
					name="label"
					control={form.control}
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Label</FormLabel>
								<FormControl>
									<Input {...field} placeholder="Label" />
								</FormControl>
							</FormItem>
						)
					}}
				/>
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
				<FormField
					name="expiration"
					control={form.control}
					render={({ field }) => {
						return (
							<FormItem className="flex flex-col">
								<FormLabel>Date of birth</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant={'outline'}
												className={cn(
													'w-[240px] pl-3 text-left font-normal',
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
												date > new Date() ||
												date < new Date('1900-01-01')
											}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
								<FormDescription>
									Your date of birth is used to calculate your
									age.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)
					}}
				/>
			</Form>
		</div>
	)
}
