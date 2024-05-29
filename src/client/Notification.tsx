import React from "react";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";

interface Props {
  isLoading: boolean;
  error: string;
  totalResults: number;
  isServedFromCache: boolean;
}

/**
 * Notification component
 * Displays result status information based on
 */
export default function Notification({
  isLoading,
  error,
  totalResults,
  isServedFromCache,
}: Props) {
  return (
    <Container className="d-flex justify-content-center mt-4">
      {!isLoading &&
        !error &&
        totalResults > 0 &&
        (isServedFromCache ? (
          <Alert variant="light">Served from cache</Alert>
        ) : (
          <Alert variant="light">Served from The Movie Database API</Alert>
        ))}
      {isLoading ? (
        <Alert variant="light">Loading...</Alert>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        totalResults === 0 && <Alert variant="dark">No results found</Alert>
      )}
    </Container>
  );
}
