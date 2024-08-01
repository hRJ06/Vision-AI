import { Mail } from "@/types";
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

export const EmailTemplate = ({ name, message }: Mail) => {
  const previewText = `Hello ${name}, Thank You for connecting with us!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>

      <Body style={main}>
        <Container style={container}>
          <Section>
            <Img
              src={`https://res.cloudinary.com/dulkbd57f/image/upload/v1722544653/mainlogo_xsjtrg.png`}
              width="100"
              height="70"
              alt="Vision AI"
            />
          </Section>
          <Section>
            <Img
              src={`https://cdn-icons-png.flaticon.com/512/603/603156.png`}
              width="96"
              height="96"
              alt={name}
              style={userImage}
            />
          </Section>
          <Section style={{ paddingBottom: "20px" }}>
            <Row>
              <Text style={heading}>Hello {name}</Text>
              <Text style={review}>"{message}"</Text>
              <Text style={paragraph}>
                Thank you for connecting with us! We are thrilled to have you
                onboard.
              </Text>
              <Text style={paragraph}>
                Vision AI offers a seamless experience for accessing and
                analyzing client data, enabling efficient and informed
                decision-making. We're excited to see how you'll leverage our
                platform to serve your clients better.
              </Text>
              </Text>
              <Button style={button} href="https://vision-ai-app.vercel.app">
                Unlock Clear Insights With Us
              </Button>
            </Row>
          </Section>

          <Hr style={hr} />

          <Section>
            <Row>
              <Text style={{ ...paragraph, fontWeight: "700" }}>FAQs</Text>
              <Text>
                <Link
                  href="https://vision-ai-app.vercel.app/privacy"
                  style={link}
                >
                  How do we collect your data?
                </Link>
              </Text>
              <Text>
                <Link
                  href="https://vision-ai-app.vercel.app/privacy"
                  style={link}
                >
                  How do insights improve decision-making?
                </Link>
              </Text>
              <Text>
                <Link href="https://visionai.com/help/article/995" style={link}>
                  Can I connect my internal database?
                </Link>
              </Text>
              <Hr style={hr} />
              <Text style={footer}>
                Vision AI, 1600 Amphitheatre Parkway, Mountain View, CA 94043
              </Text>
              <Link
                href="https://vision-ai-app.vercel.app/contact"
                style={reportLink}
              >
                Report issues
              </Link>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
  maxWidth: "100%",
};

const userImage = {
  margin: "0 auto",
  marginBottom: "16px",
  borderRadius: "50%",
};

const heading = {
  fontSize: "32px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#484848",
};

const paragraph = {
  fontSize: "18px",
  lineHeight: "1.4",
  color: "#484848",
};

const review = {
  ...paragraph,
  padding: "24px",
  backgroundColor: "#f2f3f3",
  borderRadius: "4px",
};

const button = {
  backgroundColor: "#000",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "18px",
  paddingTop: "19px",
  paddingBottom: "19px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
};

const link = {
  ...paragraph,
  color: "#0073e6",
  display: "block",
};

const reportLink = {
  fontSize: "14px",
  color: "#9ca299",
  textDecoration: "underline",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#9ca299",
  fontSize: "14px",
  marginBottom: "10px",
};
