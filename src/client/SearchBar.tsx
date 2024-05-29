import React, { useEffect, useRef } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

interface Props {
  term: string;
  isLoading: boolean;
  onTermChange: (term: string) => void;
  onSearch: () => void;
}

/**
 * Search bar component
 * Displays a search input and a search button,
 * handles search term change and search button click.
 * Displays a loading spinner when loading.
 * Refocuses on search input when loading is done.
 */
export default function SearchBar({
  term,
  isLoading,
  onTermChange,
  onSearch,
}: Props) {
  const searchInput = useRef<HTMLInputElement>(null);

  // refocus on search input when loading is done
  useEffect(() => {
    if (!isLoading) {
      searchInput?.current?.focus();
    }
  }, [isLoading]);

  const onTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onTermChange(event.target.value);
  };

  return (
    <Container>
      <Row className="mt-4">
        <Col>
          <Form.Control
            ref={searchInput}
            type="search"
            size="lg"
            placeholder="Search for movies..."
            value={term}
            disabled={isLoading}
            onChange={onTextChange}
          />
        </Col>
        <Col xs="auto">
          <Button
            variant="primary"
            size="lg"
            disabled={isLoading}
            onClick={onSearch}
          >
            {isLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                <span className="visually-hidden">Loading...</span>
              </>
            ) : (
              <>Search</>
            )}
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
