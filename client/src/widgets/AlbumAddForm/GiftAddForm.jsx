import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function GiftAddForm({ submitHandler }) {
  return (
    <Form onSubmit={submitHandler}>
      <Form.Control type="text" placeholder="Название" name="title" />
      <br />
      <Form.Control type="text" placeholder="Описание" name="desc" />
      <br />
      <Form.Control
        type="file"
        placeholder="Изображение"
        name="file"
        accept="image/*"
        required
      />
      <br />
      <Button variant="primary" type="submit">
        Добавить
      </Button>
    </Form>
  );
}
