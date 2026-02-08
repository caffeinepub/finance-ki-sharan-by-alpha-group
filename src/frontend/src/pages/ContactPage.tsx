import { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle, Instagram } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useSubmitFeedback } from '../hooks/useQueries';
import { useActor } from '../hooks/useActor';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { actor, isFetching: actorLoading } = useActor();
  const { mutate: submitFeedback, isPending } = useSubmitFeedback();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure actor is ready before submitting
    if (!actor) {
      return;
    }

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

  // Disable form while actor is initializing or during submission
  const isFormDisabled = actorLoading || !actor || isPending;

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

          <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2">
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
                <div className="space-y-2">
                  <a 
                    href="mailto:contact@financekisharan.com" 
                    className="text-primary hover:underline font-medium block"
                  >
                    contact@financekisharan.com
                  </a>
                  <a 
                    href="mailto:financekisharan@gmail.com" 
                    className="text-primary hover:underline font-medium block"
                  >
                    financekisharan@gmail.com
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Instagram className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Instagram</CardTitle>
                <CardDescription>
                  Follow us on Instagram for updates and financial education content.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <a 
                    href="https://www.instagram.com/finance_ki_sharan?utm_source=qr&igsh=MXFyN2tvNHgwdzF0Yg=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium block"
                  >
                    @finance_ki_sharan
                  </a>
                  <p className="text-sm text-muted-foreground">
                    Connect with us on Instagram for daily tips and insights.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="max-w-2xl mx-auto mt-8">
            <CardHeader>
              <CardDescription>
                Fill out the form below and we'll respond to your inquiry. You can also reach us at{' '}
                <a 
                  href="mailto:financekisharan@gmail.com" 
                  className="text-primary hover:underline font-medium"
                >
                  financekisharan@gmail.com
                </a>
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
                      disabled={isFormDisabled}
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
                      disabled={isFormDisabled}
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
                      disabled={isFormDisabled}
                    />
                  </div>
                  <Button type="submit" className="w-full gap-2" disabled={isFormDisabled}>
                    {actorLoading ? (
                      <>Loading...</>
                    ) : isPending ? (
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
