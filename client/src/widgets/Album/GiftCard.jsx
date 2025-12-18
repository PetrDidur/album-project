import React from "react";
import { Link } from "react-router";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/esm/Col";
import { ArrowRight } from "lucide-react";

export default function GiftCard({ gift }) {
  return (
    <Col xs={6}>
      <Card>
        <Card.Body>
          <Card.Title>
            {gift.title}
            <Link
              to={`/onegift/${gift.id}`}
              style={{ float: "right", textDecoration: "none" }}
            >
              <ArrowRight />
            </Link>
          </Card.Title>

          <Card.Img src={import.meta.env.VITE_IMG + `/${gift.image}`} />
        </Card.Body>
      </Card>
      <br />
    </Col>
  );
}
