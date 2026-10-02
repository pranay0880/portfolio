import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-primary text-sm font-medium">404</p>
      <h1 className="text-foreground mt-2 text-3xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground mt-2 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Button as={Link} href="/" className="mt-6">
        Back home
      </Button>
    </Container>
  );
}
