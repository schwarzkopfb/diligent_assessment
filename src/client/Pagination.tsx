import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Pagination from "react-bootstrap/Pagination";

type ItemButtonLabel = number | "…";

/**
 * Generate item button labels for numbered and ellipsis buttons
 *
 * Example:
 *   page 1,  max 20: [1, 2, 3, "…", 20]
 *   page 4,  max 20: [1, 2, 3, 4, 5, 6, "…", 20]
 *   page 8,  max 20: [1, "…", 6, 7, 8, 9, 10, "…", 20]
 *   page 15, max 20: [1, "…", 13, 14, 15, 16, 17, "…", 20]
 *   page 20, max 20: [1, "…", 18, 19, 20]
 *
 * @param current Current selected page number
 * @param last Total number of pages
 * @returns Array of item button labels
 */
function getItemButtonLabels(current: number, last: number): ItemButtonLabel[] {
  const delta = 2;
  const left = current - delta;
  const right = current + delta + 1;
  const range: number[] = [];
  const rangeWithDots: ItemButtonLabel[] = [];
  let l: number | undefined;

  for (let i = 1; i <= last; i++) {
    if (i == 1 || i == last || (i >= left && i < right)) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push("…");
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
}

interface Props {
  page: number;
  total: number;
  onChange: (page: number) => void;
}

/**
 * Pagination component
 *
 * It displays a pagination control with numbered buttons and - if needed - ellipsis buttons.
 * It also handles when no pagination at all or some pagination controls are not needed.
 */
export default function Pagination_({ page, total, onChange }: Props) {
  const createClickHandler = (page: number) => () => onChange(page);

  const items = getItemButtonLabels(page, total).map((label, i) => {
    if (label === "…") {
      return <Pagination.Ellipsis key={`pagination-${i}`} disabled />;
    }

    return (
      <Pagination.Item
        key={`pagination-${i}`}
        active={label === page}
        onClick={createClickHandler(label)}
      >
        {label}
      </Pagination.Item>
    );
  });

  if (total < 2) return null;

  return (
    <Container className="d-flex justify-content-center">
      <Row className="mt-4">
        <Pagination>
          {total > 2 && (
            <Pagination.First
              key="pagination-first"
              onClick={createClickHandler(1)}
              disabled={page === 1}
            />
          )}
          <Pagination.Prev
            key="pagination-prev"
            onClick={createClickHandler(page - 1)}
            disabled={page === 1}
          />
          {items}
          <Pagination.Next
            key="pagination-next"
            onClick={createClickHandler(page + 1)}
            disabled={page === total}
          />
          {total > 2 && (
            <Pagination.Last
              key="pagination-last"
              onClick={createClickHandler(total)}
              disabled={page === total}
            />
          )}
        </Pagination>
      </Row>
    </Container>
  );
}
