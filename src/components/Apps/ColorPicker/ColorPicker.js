import React, { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Form, Card, Alert, Button } from 'react-bootstrap'
import './ColorPicker.css'

const ColorPicker = () => {
    const [color, setColor] = useState('#3498db')
    const [rgbColor, setRgbColor] = useState('')
    const [hslColor, setHslColor] = useState('')
    const [copied, setCopied] = useState(null)
    const [image, setImage] = useState(null)
    const [imageError, setImageError] = useState('')
    const [zoomLevel, setZoomLevel] = useState(1)
    const [isEnlarged, setIsEnlarged] = useState(false)
    const canvasRef = useRef(null)
    const imageRef = useRef(null)
    const containerRef = useRef(null)

    // Convert hex to RGB
    const hexToRgb = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16)
        const g = parseInt(hex.slice(3, 5), 16)
        const b = parseInt(hex.slice(5, 7), 16)
        return { r, g, b }
    }

    // Convert RGB to HSL
    const rgbToHsl = (r, g, b) => {
        r /= 255
        g /= 255
        b /= 255

        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        let h,
            s,
            l = (max + min) / 2

        if (max === min) {
            h = s = 0 // achromatic
        } else {
            const d = max - min
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0)
                    break
                case g:
                    h = (b - r) / d + 2
                    break
                case b:
                    h = (r - g) / d + 4
                    break
                default:
                    break
            }

            h /= 6
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        }
    }

    // RGB to Hex conversion
    const rgbToHex = (r, g, b) => {
        return (
            '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
        )
    }

    // Update color formats when the color changes
    useEffect(() => {
        const { r, g, b } = hexToRgb(color)
        setRgbColor(`rgb(${r}, ${g}, ${b})`)

        const { h, s, l } = rgbToHsl(r, g, b)
        setHslColor(`hsl(${h}, ${s}%, ${l}%)`)
    }, [color])

    // Copy to clipboard function
    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(type)
            setTimeout(() => setCopied(null), 1500)
        })
    }

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return

        // Reset error and zoom
        setImageError('')
        setZoomLevel(1)
        setIsEnlarged(false)

        // Check file type
        if (!file.type.match('image.*')) {
            setImageError('Please select an image file')
            return
        }

        const reader = new FileReader()
        reader.onload = (event) => {
            const img = new Image()
            img.onload = () => {
                setImage(img)
            }
            img.onerror = () => {
                setImageError('Failed to load image')
            }
            img.src = event.target.result
        }
        reader.readAsDataURL(file)
    }

    // Draw image on canvas when image changes or zoom level changes
    useEffect(() => {
        if (image && canvasRef.current) {
            const canvas = canvasRef.current
            const ctx = canvas.getContext('2d')

            // Set canvas dimensions based on image and zoom
            const maxWidth = isEnlarged ? 1000 : 800
            const maxHeight = isEnlarged ? 600 : 400

            let width = image.width * zoomLevel
            let height = image.height * zoomLevel

            // Scale down if image is too large
            if (width > maxWidth) {
                const ratio = maxWidth / width
                width = maxWidth
                height = height * ratio
            }

            if (height > maxHeight) {
                const ratio = maxHeight / height
                height = maxHeight
                width = width * ratio
            }

            canvas.width = width
            canvas.height = height

            // Draw image on canvas with zoom
            ctx.imageSmoothingEnabled = zoomLevel < 3 // Disable smoothing for high zoom levels
            ctx.drawImage(
                image,
                0,
                0,
                image.width,
                image.height,
                0,
                0,
                width,
                height
            )

            // Store the image reference
            imageRef.current = {
                width,
                height,
                originalWidth: image.width,
                originalHeight: image.height
            }
        }
    }, [image, zoomLevel, isEnlarged])

    // Handle canvas click to pick color
    const handleCanvasClick = (e) => {
        if (!canvasRef.current || !imageRef.current) return

        const canvas = canvasRef.current
        const rect = canvas.getBoundingClientRect()

        // Calculate click position relative to canvas
        const x = Math.floor(
            (e.clientX - rect.left) * (canvas.width / rect.width)
        )
        const y = Math.floor(
            (e.clientY - rect.top) * (canvas.height / rect.height)
        )

        // Get pixel data
        const ctx = canvas.getContext('2d')
        const pixelData = ctx.getImageData(x, y, 1, 1).data

        // Convert to hex
        const hex = rgbToHex(pixelData[0], pixelData[1], pixelData[2])
        setColor(hex)

        // Draw a marker at the picked position
        drawColorMarker(x, y, hex)
    }

    // Draw a marker at the picked position
    const drawColorMarker = (x, y, hex) => {
        if (!canvasRef.current || !imageRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        // Redraw the image to clear previous markers
        if (image) {
            ctx.imageSmoothingEnabled = zoomLevel < 3
            ctx.drawImage(
                image,
                0,
                0,
                image.width,
                image.height,
                0,
                0,
                imageRef.current.width,
                imageRef.current.height
            )
        }

        // Draw marker
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, 2 * Math.PI)
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(x, y, 5, 0, 2 * Math.PI)
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 1
        ctx.stroke()
    }

    // Handle zoom in
    const handleZoomIn = () => {
        if (zoomLevel < 5) {
            setZoomLevel((prevZoom) => prevZoom + 0.5)
        }
    }

    // Handle zoom out
    const handleZoomOut = () => {
        if (zoomLevel > 1) {
            setZoomLevel((prevZoom) => prevZoom - 0.5)
        }
    }

    // Handle reset zoom
    const handleResetZoom = () => {
        setZoomLevel(1)
    }

    // Toggle enlarged view
    const toggleEnlargedView = () => {
        setIsEnlarged(!isEnlarged)
    }

    return (
        <Container className="color-picker-container">
            <h1 className="text-center color-picker-title">Color Picker</h1>

            <Row className="mb-4">
                <Col>
                    <Card className="image-picker-card">
                        <Card.Body>
                            <h4>Pick Color from Image</h4>
                            <p className="text-muted">
                                Upload an image and click on it to pick colors
                            </p>

                            <Alert variant="info" className="privacy-notice">
                                <strong>Privacy Notice:</strong> Your images are
                                processed entirely in your browser. No images
                                are uploaded to any server or stored anywhere.
                                All processing happens locally on your device.
                            </Alert>

                            <Form.Group className="mb-3">
                                <Form.Label>Upload Image</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                                {imageError && (
                                    <Alert variant="danger" className="mt-2">
                                        {imageError}
                                    </Alert>
                                )}
                            </Form.Group>

                            <div
                                className="canvas-container"
                                ref={containerRef}
                                style={{
                                    height: isEnlarged ? '600px' : 'auto',
                                    overflow: 'auto'
                                }}
                            >
                                {image ? (
                                    <canvas
                                        ref={canvasRef}
                                        onClick={handleCanvasClick}
                                        className="color-picker-canvas"
                                    />
                                ) : (
                                    <div className="empty-canvas">
                                        <p>Upload an image to pick colors</p>
                                    </div>
                                )}
                            </div>

                            {image && (
                                <>
                                    <div className="image-controls">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={handleZoomOut}
                                            disabled={zoomLevel <= 1}
                                            className="zoom-btn"
                                        >
                                            <span>-</span> Zoom Out
                                        </Button>

                                        <span className="zoom-level">
                                            {Math.round(zoomLevel * 100)}%
                                        </span>

                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={handleZoomIn}
                                            disabled={zoomLevel >= 5}
                                            className="zoom-btn"
                                        >
                                            <span>+</span> Zoom In
                                        </Button>

                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={handleResetZoom}
                                            disabled={zoomLevel === 1}
                                            className="zoom-btn"
                                        >
                                            Reset Zoom
                                        </Button>

                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={toggleEnlargedView}
                                            className="zoom-btn"
                                        >
                                            {isEnlarged
                                                ? 'Shrink View'
                                                : 'Enlarge View'}
                                        </Button>
                                    </div>

                                    <p className="text-center mt-2 text-muted">
                                        Click anywhere on the image to pick a
                                        color. Zoom in for more precision.
                                    </p>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col md={6} className="mb-3 mb-md-0">
                    <Card className="color-display-card">
                        <Card.Body>
                            <h4>Selected Color</h4>
                            <div
                                className="color-display"
                                style={{ backgroundColor: color }}
                            ></div>
                            <Form.Group className="mt-3">
                                <Form.Label>Color Value</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mt-3">
                                <Form.Label>Color Picker</Form.Label>
                                <Form.Control
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-100"
                                />
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="color-formats-card">
                        <Card.Body>
                            <h4>Color Formats</h4>
                            <div className="color-format-item">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span>HEX:</span>
                                    <code>{color}</code>
                                    <button
                                        className="copy-btn"
                                        onClick={() =>
                                            copyToClipboard(color, 'hex')
                                        }
                                    >
                                        {copied === 'hex' ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                            </div>

                            <div className="color-format-item">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span>RGB:</span>
                                    <code>{rgbColor}</code>
                                    <button
                                        className="copy-btn"
                                        onClick={() =>
                                            copyToClipboard(rgbColor, 'rgb')
                                        }
                                    >
                                        {copied === 'rgb' ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                            </div>

                            <div className="color-format-item">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span>HSL:</span>
                                    <code>{hslColor}</code>
                                    <button
                                        className="copy-btn"
                                        onClick={() =>
                                            copyToClipboard(hslColor, 'hsl')
                                        }
                                    >
                                        {copied === 'hsl' ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col>
                    <Card className="attribution-card">
                        <Card.Body>
                            <h5>About This Tool</h5>
                            <p className="mb-2">
                                This Color Picker tool allows you to extract
                                colors from images and convert between different
                                color formats.
                            </p>
                            <p className="mb-0 small text-muted">
                                Built with{' '}
                                <a
                                    href="https://react-bootstrap.github.io/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    React Bootstrap
                                </a>{' '}
                                and the HTML5 Canvas API. Color conversion
                                algorithms adapted from common web development
                                practices. This tool is part of The
                                All-Inclusive App and is provided for
                                educational and personal use.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default ColorPicker
