import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type ContactNotificationProps = {
  name: string;
  email: string;
  message: string;
};

export default function ContactNotification({ name, email, message }: ContactNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>New portfolio contact form submission from {name}</Preview>
      <Body style={{ fontFamily: "sans-serif", backgroundColor: "#f4f4f5" }}>
        <Container
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 12,
            padding: 32,
            maxWidth: 480,
            margin: "40px auto",
          }}
        >
          <Heading style={{ fontSize: 20, marginBottom: 4 }}>New contact form submission</Heading>
          <Text style={{ color: "#52525b", marginTop: 0 }}>
            Someone reached out through your portfolio site.
          </Text>

          <Hr />

          <Text style={{ marginBottom: 4 }}>
            <strong>Name:</strong> {name}
          </Text>
          <Text style={{ marginBottom: 4 }}>
            <strong>Email:</strong> {email}
          </Text>
          <Section style={{ marginTop: 12 }}>
            <Text style={{ whiteSpace: "pre-wrap" }}>{message}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
