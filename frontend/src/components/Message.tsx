import type { ReactNode } from "react";
import { Alert } from "react-bootstrap";
import type { AlertProps } from "react-bootstrap"; // для типа variant

interface MessageProps {
  variant?: AlertProps["variant"]; // 'primary' | 'info' | ... (из типов RBS)
  children: ReactNode;
}

const Message = ({ variant = "info", children }: MessageProps) => {
  return <Alert variant={variant}>{children}</Alert>;
};

export default Message;
