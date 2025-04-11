import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FaEnvelope, FaPhone, FaLinkedin } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactSection() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    setSubmitting(true);
    contactMutation.mutate(data);
    setSubmitting(false);
  };

  return (
    <section id="contact" className="py-20 px-4 bg-gradient-to-br from-blue-100 to-blue-50 section-fade">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Get In Touch</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Feel free to reach out for collaborations, opportunities, or just a friendly chat.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-100">
            <h3 className="text-xl font-display font-semibold mb-6">Send Me a Message</h3>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 mb-2 font-medium">Name</label>
                <Input
                  id="name"
                  placeholder="Your Name"
                  {...form.register("name")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your Email"
                  {...form.register("email")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="subject" className="block text-gray-700 mb-2 font-medium">Subject</label>
                <Input
                  id="subject"
                  placeholder="Subject"
                  {...form.register("subject")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {form.formState.errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.subject.message}</p>
                )}
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 mb-2 font-medium">Message</label>
                <Textarea
                  id="message"
                  rows={4}
                  placeholder="Your Message"
                  {...form.register("message")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {form.formState.errors.message && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.message.message}</p>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full py-3 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
                disabled={submitting || contactMutation.isPending}
              >
                {(submitting || contactMutation.isPending) ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
          
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-display font-semibold mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <FaEnvelope className="text-primary" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Email</p>
                    <a href="mailto:akshaykamble7776@gmail.com" className="text-gray-800 font-medium hover:text-primary">
                      akshaykamble7776@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <FaPhone className="text-primary" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Phone</p>
                    <a href="tel:+917776995166" className="text-gray-800 font-medium hover:text-primary">
                      +91 7776995166
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <FaLinkedin className="text-primary" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">LinkedIn</p>
                    <a 
                      href="https://www.linkedin.com/in/akshay-kamble-sd/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-800 font-medium hover:text-primary"
                    >
                      www.linkedin.com/in/akshay-kamble-sd/
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg mt-8 md:mt-0">
              <h4 className="font-display font-semibold mb-3">Looking for a dedicated developer?</h4>
              <p className="text-gray-700 mb-4">I'm currently open to new opportunities and collaborations.</p>
              <a 
                href="/Akshay Kamble Resume.pdf"
                download="Akshay_Kamble_Resume.pdf"
                className="inline-block px-5 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
              >
                Download Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
