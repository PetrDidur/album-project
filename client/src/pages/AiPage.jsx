import React, { useState } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Button, 
  Form, 
  Card, 
  Alert,
  Image,
  ProgressBar,
  Dropdown,
  DropdownButton,
  Modal
} from 'react-bootstrap';
import { useNavigate } from 'react-router'; // Добавляем useNavigate
import 'bootstrap/dist/css/bootstrap.min.css';

const AiPage = () => {
  const navigate = useNavigate(); // Инициализируем навигацию
  
  // Состояния для генерации
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('digital_art');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [numVariations, setNumVariations] = useState(4);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveToAlbum, setSaveToAlbum] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [aiAlbums, setAiAlbums] = useState([
    { id: 1, name: 'AI Пейзажи', count: 12 },
    { id: 2, name: 'Космические сцены', count: 8 },
    { id: 3, name: 'Портреты в стиле', count: 5 },
    { id: 4, name: 'Абстракции', count: 15 }
  ]);

  // Стили для генерации
  const styles = [
    { id: 'digital_art', name: 'Цифровое искусство', icon: '🎨' },
    { id: 'photo', name: 'Фотореализм', icon: '📷' },
    { id: 'watercolor', name: 'Акварель', icon: '🖌️' },
    { id: 'oil_painting', name: 'Масляная живопись', icon: '🖼️' },
    { id: 'anime', name: 'Аниме', icon: '🇯🇵' },
    { id: 'pixel_art', name: 'Пиксель-арт', icon: '👾' },
    { id: 'cyberpunk', name: 'Киберпанк', icon: '🔮' },
    { id: 'fantasy', name: 'Фэнтези', icon: '🐉' }
  ];

  // Соотношения сторон
  const aspectRatios = [
    { id: '1:1', name: 'Квадрат (1:1)' },
    { id: '4:3', name: 'Классическое (4:3)' },
    { id: '16:9', name: 'Широкоэкранное (16:9)' },
    { id: '9:16', name: 'Портретное (9:16)' },
    { id: '3:2', name: 'Фотография (3:2)' }
  ];

  // Примеры промптов
  const promptExamples = [
    'Космический кот в стиле Ван Гога',
    'Фотореалистичный пейзаж заснеженной планеты с двумя солнцами',
    'Замок из облаков в стиле аниме',
    'Подводный город будущего с биолюминесцентными растениями',
    'Робот, рисующий картину в стиле импрессионизма',
    'Волшебный лес с плавающими островами и светлячками',
    'Киберпанк улица Токио в дождливую ночь',
    'Дракон и единорог играют в шахматы в средневековой библиотеке'
  ];

  // Уведомления
  const showAlert = (message, variant = 'success') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
  };

  // Генерация изображений (моковая функция)
  const handleGenerate = () => {
    if (!prompt.trim()) {
      showAlert('Введите описание для генерации', 'warning');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    // Имитация процесса генерации
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          
          // Генерация моковых изображений
          const mockImages = Array.from({ length: numVariations }, (_, i) => ({
            id: Date.now() + i,
            url: `https://via.placeholder.com/${getAspectRatioDimensions(aspectRatio)}/${getRandomColor()}/FFFFFF?text=${encodeURIComponent(prompt.substring(0, 20))}`,
            prompt: prompt,
            style: selectedStyle,
            aspectRatio: aspectRatio,
            timestamp: new Date().toISOString()
          }));
          
          setGeneratedImages(mockImages);
          showAlert(`Сгенерировано ${numVariations} вариантов!`, 'success');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Вспомогательная функция для размеров
  const getAspectRatioDimensions = (ratio) => {
    const ratios = {
      '1:1': '400x400',
      '4:3': '400x300',
      '16:9': '400x225',
      '9:16': '225x400',
      '3:2': '400x267'
    };
    return ratios[ratio] || '400x400';
  };

  // Случайный цвет для placeholder
  const getRandomColor = () => {
    const colors = ['6C5CE7', '00B894', 'FD79A8', 'FDCB6E', '0984E3', '00CEC9', 'E17055', 'D63031'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Сохранение изображения
  const handleSaveImage = (image) => {
    setSelectedImage(image);
    setShowSaveModal(true);
  };

  const confirmSave = () => {
    if (!saveToAlbum && aiAlbums.length > 0) {
      setSaveToAlbum(aiAlbums[0].name);
    }

    // Здесь будет реальная логика сохранения
    showAlert(`Изображение сохранено в альбом "${saveToAlbum || 'AI Фотоальбом'}"`, 'success');
    setShowSaveModal(false);
    
    // Обновляем счетчик альбома
    if (saveToAlbum) {
      setAiAlbums(prev => prev.map(album => 
        album.name === saveToAlbum 
          ? { ...album, count: album.count + 1 }
          : album
      ));
    }
  };

  // Создание нового альбома
  const handleCreateAlbum = () => {
    const newAlbumName = prompt('Введите название нового альбома:');
    if (newAlbumName && newAlbumName.trim()) {
      const newAlbum = {
        id: Date.now(),
        name: newAlbumName.trim(),
        count: 0
      };
      setAiAlbums(prev => [...prev, newAlbum]);
      setSaveToAlbum(newAlbumName.trim());
      showAlert(`Создан альбом "${newAlbumName}"`, 'success');
    }
  };

  // Выбор примера промпта
  const selectExample = (example) => {
    setPrompt(example);
  };

  // Функция для перехода к альбомам
  const handleBackToAlbums = () => {
    navigate('/userPage');
  };

  return (
    <Container className="py-4">
      {/* Уведомления */}
      {alert.show && (
        <Alert 
          variant={alert.variant} 
          onClose={() => setAlert({ ...alert, show: false })} 
          dismissible
          className="position-fixed top-0 start-50 translate-middle-x mt-3"
          style={{ zIndex: 1050 }}
        >
          {alert.message}
        </Alert>
      )}

      {/* Заголовок с кнопкой "Назад" */}
      <Row className="mb-4 align-items-center">
        <Col md={8}>
          <div className="d-flex align-items-center">
            <Button 
              variant="outline-secondary" 
              onClick={handleBackToAlbums}
              className="me-3"
              title="Вернуться к моим альбомам"
            >
              ← К альбомам
            </Button>
            <div>
              <h1 className="display-5 fw-bold mb-1">🎨 AI Генерация изображений</h1>
              <p className="text-muted mb-0">
                Опишите вашу идею словами, и ИИ создаст уникальные изображения
              </p>
            </div>
          </div>
        </Col>
        <Col md={4} className="text-md-end mt-2 mt-md-0">
          <Button 
            variant="outline-primary" 
            onClick={() => navigate('/')}
            className="me-2"
          >
            На главную
          </Button>
          <Button 
            variant="outline-info" 
            onClick={() => navigate('/userPage')}
          >
            📁 Мои альбомы
          </Button>
        </Col>
      </Row>

      {/* Основной контент */}
      <Row>
        {/* Левая колонка - ввод и настройки */}
        <Col lg={5} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <h4 className="mb-4">📝 Творческий промпт</h4>
              
              {/* Поле для промпта */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-medium">
                  Опишите то, что хотите увидеть:
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Например: «Космический кот в стиле Ван Гога» или «Фотореалистичный пейзаж заснеженной планеты с двумя солнцами»"
                  className="border-2"
                  disabled={isGenerating}
                />
                <Form.Text className="text-muted">
                  Чем подробнее описание, тем лучше результат
                </Form.Text>
              </Form.Group>

              {/* Примеры промптов */}
              <div className="mb-4">
                <h6 className="fw-medium mb-3">💡 Примеры для вдохновения:</h6>
                <div className="d-flex flex-wrap gap-2">
                  {promptExamples.map((example, index) => (
                    <Button
                      key={index}
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => selectExample(example)}
                      className="text-start"
                      style={{ maxWidth: '100%', whiteSpace: 'normal' }}
                    >
                      {example}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Панель настроек */}
              <div className="mb-4">
                <h4 className="mb-3">⚙️ Настройки генерации</h4>
                
                {/* Выбор стиля */}
                <Form.Group className="mb-3">
                  <Form.Label>Стиль изображения</Form.Label>
                  <div className="d-flex flex-wrap gap-2">
                    {styles.map(style => (
                      <Button
                        key={style.id}
                        variant={selectedStyle === style.id ? 'primary' : 'outline-secondary'}
                        size="sm"
                        onClick={() => setSelectedStyle(style.id)}
                        className="d-flex align-items-center"
                      >
                        <span className="me-2">{style.icon}</span>
                        {style.name}
                      </Button>
                    ))}
                  </div>
                </Form.Group>

                {/* Соотношение сторон */}
                <Form.Group className="mb-3">
                  <Form.Label>Соотношение сторон</Form.Label>
                  <div className="d-flex flex-wrap gap-2">
                    {aspectRatios.map(ratio => (
                      <Button
                        key={ratio.id}
                        variant={aspectRatio === ratio.id ? 'primary' : 'outline-secondary'}
                        size="sm"
                        onClick={() => setAspectRatio(ratio.id)}
                      >
                        {ratio.name}
                      </Button>
                    ))}
                  </div>
                </Form.Group>

                {/* Количество вариантов */}
                <Form.Group className="mb-4">
                  <Form.Label>Количество вариантов: {numVariations}</Form.Label>
                  <Form.Range
                    min="1"
                    max="8"
                    step="1"
                    value={numVariations}
                    onChange={(e) => setNumVariations(parseInt(e.target.value))}
                    disabled={isGenerating}
                  />
                </Form.Group>
              </div>

              {/* Кнопка генерации */}
              <Button
                variant="primary"
                size="lg"
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-100 py-3"
              >
                {isGenerating ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Генерация... {generationProgress}%
                  </>
                ) : (
                  '🚀 Сгенерировать изображения'
                )}
              </Button>

              {isGenerating && (
                <ProgressBar 
                  animated 
                  now={generationProgress} 
                  label={`${generationProgress}%`} 
                  className="mt-3"
                />
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Правая колонка - результаты */}
        <Col lg={7}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">🖼️ Результаты генерации</h4>
                <div>
                  {generatedImages.length > 0 && (
                    <>
                      <span className="text-muted me-3">
                        {generatedImages.length} вариантов
                      </span>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={handleBackToAlbums}
                      >
                        ← В альбомы
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {generatedImages.length === 0 ? (
                // Состояние до генерации
                <div className="text-center py-5">
                  <div className="display-1 text-muted mb-4">🎨</div>
                  <h4 className="mb-3">Здесь появятся ваши творения</h4>
                  <p className="text-muted mb-4">
                    Введите описание и нажмите "Сгенерировать", чтобы ИИ создал уникальные изображения по вашему запросу
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                    <Button 
                      variant="outline-primary"
                      onClick={handleBackToAlbums}
                    >
                      ← Вернуться к альбомам
                    </Button>
                    <Button 
                      variant="outline-secondary"
                      onClick={() => navigate('/')}
                    >
                      На главную
                    </Button>
                  </div>
                </div>
              ) : (
                // Сетка сгенерированных изображений
                <>
                  <Row className="g-3 mb-4">
                    {generatedImages.map(image => (
                      <Col key={image.id} xs={6} md={6} lg={6}>
                        <Card className="border-0 shadow-sm h-100">
                          <Card.Img
                            variant="top"
                            src={image.url}
                            style={{ height: '200px', objectFit: 'cover' }}
                          />
                          <Card.Body className="p-3">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <small className="text-muted d-block">
                                  Стиль: {styles.find(s => s.id === image.style)?.name}
                                </small>
                                <small className="text-muted">
                                  Размер: {image.aspectRatio}
                                </small>
                              </div>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleSaveImage(image)}
                              >
                                💾 Сохранить
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>

                  {/* Действия с результатами */}
                  <Card className="border-primary bg-light">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">📁 Сохранить все в AI Фотоальбом</h5>
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          onClick={handleBackToAlbums}
                        >
                          ← Просмотреть альбомы
                        </Button>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <DropdownButton
                            variant="outline-primary"
                            title={saveToAlbum || "Выберите альбом"}
                            className="me-3"
                          >
                            {aiAlbums.map(album => (
                              <Dropdown.Item 
                                key={album.id}
                                onClick={() => setSaveToAlbum(album.name)}
                              >
                                {album.name} ({album.count} фото)
                              </Dropdown.Item>
                            ))}
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={handleCreateAlbum}>
                              + Создать новый альбом
                            </Dropdown.Item>
                          </DropdownButton>
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={handleCreateAlbum}
                          >
                            + Новый альбом
                          </Button>
                        </div>
                        <Button 
                          variant="primary"
                          onClick={() => {
                            generatedImages.forEach(img => handleSaveImage(img));
                            showAlert('Все изображения сохранены!', 'success');
                          }}
                        >
                          💾 Сохранить все {generatedImages.length} фото
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Список AI альбомов */}
      <Row className="mt-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h4 className="mb-0">📚 Мои AI Фотоальбомы</h4>
                  <p className="text-muted small mb-0">
                    Специальные альбомы для творческих работ
                  </p>
                </div>
                <div className="d-flex gap-2">
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={handleBackToAlbums}
                  >
                    ← Все альбомы
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={handleCreateAlbum}
                  >
                    + Создать AI альбом
                  </Button>
                </div>
              </div>
              
              {aiAlbums.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted">У вас пока нет AI альбомов</p>
                  <Button 
                    variant="outline-primary"
                    onClick={handleCreateAlbum}
                    className="me-2"
                  >
                    Создать первый AI альбом
                  </Button>
                  <Button 
                    variant="outline-secondary"
                    onClick={handleBackToAlbums}
                  >
                    ← К обычным альбомам
                  </Button>
                </div>
              ) : (
                <>
                  <Row className="g-3">
                    {aiAlbums.map(album => (
                      <Col key={album.id} xs={6} md={4} lg={3}>
                        <Card 
                          className="border-0 shadow-sm h-100 hover-shadow" 
                          role="button"
                          onClick={() => {
                            // Можно добавить переход в конкретный AI альбом
                            showAlert(`Открыт альбом "${album.name}"`, 'info');
                          }}
                        >
                          <Card.Body className="text-center">
                            <div className="display-6 mb-2">🎨</div>
                            <h6 className="mb-1">{album.name}</h6>
                            <small className="text-muted d-block">
                              {album.count} изображений
                            </small>
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              className="mt-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSaveToAlbum(album.name);
                                showAlert(`Выбран альбом "${album.name}" для сохранения`, 'info');
                              }}
                            >
                              Сохранять сюда
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                  
                  <div className="text-center mt-4">
                    <Button 
                      variant="outline-secondary"
                      onClick={handleBackToAlbums}
                      className="w-100"
                    >
                      ← Вернуться ко всем альбомам
                    </Button>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Модальное окно сохранения */}
      <Modal show={showSaveModal} onHide={() => setShowSaveModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>💾 Сохранить изображение</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedImage && (
            <div className="text-center mb-3">
              <Image 
                src={selectedImage.url} 
                thumbnail 
                className="mb-3"
                style={{ maxHeight: '200px' }}
              />
              <p>
                <strong>Описание:</strong> {selectedImage.prompt.substring(0, 100)}...
              </p>
            </div>
          )}
          
          <Form.Group>
            <Form.Label>Выберите альбом для сохранения:</Form.Label>
            <Form.Select 
              value={saveToAlbum}
              onChange={(e) => setSaveToAlbum(e.target.value)}
            >
              <option value="">-- Выберите альбом --</option>
              {aiAlbums.map(album => (
                <option key={album.id} value={album.name}>
                  {album.name} ({album.count} фото)
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          
          <div className="mt-3">
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={handleCreateAlbum}
              className="w-100"
            >
              + Создать новый альбом
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex justify-content-between w-100">
            <Button variant="outline-secondary" onClick={() => setShowSaveModal(false)}>
              Отмена
            </Button>
            <div className="d-flex gap-2">
              <Button 
                variant="outline-info" 
                onClick={handleBackToAlbums}
              >
                Просмотреть альбомы
              </Button>
              <Button 
                variant="primary" 
                onClick={confirmSave} 
                disabled={!saveToAlbum}
              >
                Сохранить в "{saveToAlbum || 'альбом'}"
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AiPage;