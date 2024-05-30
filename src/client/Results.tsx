import React from "react";
import Image from "react-image-fallback";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Stack from "react-bootstrap/Stack";
import Movie from "./types/Movie";
import { TMDB_IMAGE_BASE_URL, POSTER_PLACEHOLDER_URL } from "./consts";

/**
 * Separate items into rows
 *
 * @param items Items to separate
 * @param itemsPerRow Number of items per row
 * @returns Array of rows
 */
function separateToRows<T>(items: T[], itemsPerRow: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += itemsPerRow) {
    rows.push(items.slice(i, i + itemsPerRow));
  }
  return rows;
}

/**
 * Round a number to one decimal
 *
 * @param value Number to round
 * @returns Rounded number
 */
function roundToOneDecimal(value: number) {
  return Math.round(value * 10) / 10;
}

/**
 * Get year from a date string
 *
 * @param date Date string
 * @returns Year
 */
function getYear(date: string) {
  return new Date(date).getFullYear() || "";
}

interface Props {
  results: Movie[];
}

/**
 * Results component
 * Displays search results in 4 columns grid layout. Handles missing movie metadata.
 */
export default function Results({ results }: Props) {
  const rows = separateToRows(results, 4);

  return (
    <Container>
      {rows.map((row, i) => (
        <Row key={`res-row-${i}`}>
          {row.map((movie, j) => {
            const release = getYear(movie.release_date);
            const rating = roundToOneDecimal(movie.vote_average) || "";

            return (
              <Col
                key={`res-row-${i}-col-${j}`}
                className="mb-3 col-md-3 col-sm-6 col-xs-12"
              >
                <Card className="result-card">
                  <Image
                    src={
                      movie.poster_path
                        ? `${TMDB_IMAGE_BASE_URL}/${movie.poster_path}`
                        : POSTER_PLACEHOLDER_URL
                    }
                    fallbackImage={POSTER_PLACEHOLDER_URL}
                  />
                  <Card.Body>
                    <Stack direction="horizontal" gap={2} className="mb-2">
                      {release && <Badge bg="secondary">{release}</Badge>}
                      {rating && <Badge bg="warning">{rating}</Badge>}
                    </Stack>
                    <Card.Title>{movie.title}</Card.Title>
                    <Card.Text>{movie.overview}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      ))}
    </Container>
  );
}
