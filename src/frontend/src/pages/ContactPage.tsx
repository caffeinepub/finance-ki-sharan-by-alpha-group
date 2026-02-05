import { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useSubmitFeedback } from '../hooks/useQueries';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { mutate: submitFeedback, isPending } = useSubmitFeedback();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFeedback(
      { name, email, message },
      {
        onSuccess: () => {
          setSubmitted(true);
          setName('');
          setEmail('');
          setMessage('');
          setTimeout(() => setSubmitted(false), 5000);
        },
      }
    );
  };

  return (
    <div className="w-full">
      <div className="bg-gradient-to-b from-primary/10 to-background">
        <div className="container py-16 md:py-24">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <MessageSquare className="h-4 w-4" />
              Get in Touch
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Contact Us
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Email Us</CardTitle>
                <CardDescription>
                  Send us an email and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <a 
                  href="mailto:contact@financekisharan.com" 
                  className="text-primary hover:underline font-medium"
                >
                  contact@financekisharan.com
                </a>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Feedback</CardTitle>
                <CardDescription>
                  Your feedback helps us improve our educational content and services.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Use the form to share your thoughts, suggestions, or report any issues.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="max-w-2xl mx-auto mt-8">
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll respond to your inquiry.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <CheckCircle className="h-16 w-16 text-primary" />
                  <h3 className="text-xl font-semibold">Thank You!</h3>
                  <p className="text-muted-foreground text-center">
                    Your message has been received. We'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Your message or feedback..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={6}
                    />
                  </div>
                  <Button type="submit" className="w-full gap-2" disabled={isPending}>
                    {isPending ? (
                      <>Sending...</>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
