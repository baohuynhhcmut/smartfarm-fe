import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
    currentpassword: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    newpassword: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export function PasswordForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // defaultValues: {
    //   username: "",
    // },
  });


  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="gap-y-2 flex flex-col">
        <FormField
          control={form.control}
          name="currentpassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#374151]">Current password</FormLabel>
              <FormControl>
                <Input className="pl-2!"  type="password" {...field} placeholder="abc"/>
              </FormControl>
            </FormItem>
          )}
        />

        
        <FormField
          control={form.control}
          name="newpassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#374151]">New password</FormLabel>
              <FormControl>
                <Input className="pl-2!"  type="password" {...field} placeholder="abc" />
              </FormControl>
            </FormItem>
          )}
        />
        
        
        <div className="flex justify-end">
            <Button type="submit" className="p-2! w-40 bg-pink-500 rounded-2xl font-bold uppercase">Change password</Button>
        </div>
      </form>
    </Form>
  );
}
