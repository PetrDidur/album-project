// pages/MainPage.jsx
import React from 'react';
import { useNavigate } from 'react-router';
import { Container, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const MainPage = ({ user }) => {
  const navigate = useNavigate();
  const isLoggedIn = user.status === "logged";

  const handleStart = () => {
    if (isLoggedIn) {
      navigate('/userPage');
    } else {
      navigate('/auth');
    }
  };

  return (
    <Container className="flex-grow-1 d-flex flex-column justify-content-center py-5">
      <Card className="border-0 shadow mx-auto" style={{ maxWidth: '600px' }}>
        <Card.Body className="p-5 text-center">
          
          {!isLoggedIn ? (
            // Для НЕзарегистрированного пользователя
            <>
              <h1 className="display-5 mb-4">Создавайте и храните воспоминания</h1>
              
              <p className="text-muted mb-5">
                Memoria — это платформа для создания красивых цифровых альбомов. 
                Загружайте фотографии, выбирайте оформление, добавляйте заметки 
                и делитесь воспоминаниями с близкими.
              </p>
              
              <div className="d-grid">
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={handleStart}
                  className="py-3"
                >
                  Начать
                </Button>
              </div>
            </>
          ) : (
            // Для зарегистрированного пользователя
            <>
              <h1 className="display-5 mb-4">С возвращением, {user.data?.name || ''}!</h1>
              
              <p className="text-muted mb-5">
                Создавайте новые альбомы, редактируйте существующие, 
                приглашайте друзей для совместной работы. 
                Все ваши воспоминания в безопасности и всегда под рукой.
              </p>
              
              <div className="d-grid gap-3">
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={handleStart}
                  className="py-3"
                >
                  Перейти к моим альбомам
                </Button>
              </div>
            </>
          )}
          
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MainPage;