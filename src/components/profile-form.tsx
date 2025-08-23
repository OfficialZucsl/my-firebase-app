'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Textarea } from './ui/textarea';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number.'),
  nationalId: z.string().min(5, 'Please enter a valid National ID number.'),
  employmentStatus: z.enum(['Employed', 'Self-Employed', 'Unemployed', 'Student']),
  employerName: z.string().optional(),
  workplaceAddress: z.string().optional(),
  supervisorContact: z.string().optional(),
  monthlyIncome: z.coerce.number().min(0, 'Monthly income cannot be negative.'),
});

export default function ProfileForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      nationalId: '',
      employmentStatus: 'Employed',
      employerName: '',
      workplaceAddress: '',
      supervisorContact: '',
      monthlyIncome: 0,
    },
  });

  const { formState, watch } = form;
  const employmentStatus = watch('employmentStatus');

  const onSubmit = (values: z.infer<typeof profileSchema>) => {
    console.log(values);
    toast({
      title: 'Profile Updated!',
      description: 'Your information has been saved successfully.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
            <CardDescription>
              This information helps us verify your identity.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="e.g., jane.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 0977123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="nationalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>National ID Number (NRC)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 123456/78/9" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Employment & Financial Profile</CardTitle>
                <CardDescription>This information is used to assess loan eligibility.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <FormField
                    control={form.control}
                    name="employmentStatus"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Employment Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select your employment status" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Employed">Employed</SelectItem>
                                <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                                <SelectItem value="Unemployed">Unemployed</SelectItem>
                                <SelectItem value="Student">Student</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                
                {(employmentStatus === 'Employed' || employmentStatus === 'Self-Employed') && (
                    <>
                         <FormField
                            control={form.control}
                            name="employerName"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Name of Employer / Business</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., XYZ Corporation" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                         />
                         <FormField
                            control={form.control}
                            name="workplaceAddress"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Workplace Address</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="e.g., 123 Main St, Lusaka" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                         />
                          <FormField
                            control={form.control}
                            name="supervisorContact"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Supervisor / Business Contact</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., 0966123456" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                         />
                    </>
                )}


                <FormField
                    control={form.control}
                    name="monthlyIncome"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Monthly Income (ZMW)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 8500" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
             <CardFooter className="flex justify-end">
                <Button type="submit" disabled={formState.isSubmitting}>
                    {formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
             </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
