import React, { useState, useRef, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './QRCodeGenerator.css'
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Card,
    Alert,
    Spinner,
    Tabs,
    Tab
} from 'react-bootstrap'

const QRCodeGenerator = () => {
    const [input, setInput] = useState('')
    const [qrValue, setQrValue] = useState('')
    const [size, setSize] = useState(256)
    const [bgColor, setBgColor] = useState('#FFFFFF')
    const [fgColor, setFgColor] = useState('#000000')
    const [includeMargin, setIncludeMargin] = useState(true)
    const [errorLevel, setErrorLevel] = useState('M')
    const [isGenerating, setIsGenerating] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [activeTab, setActiveTab] = useState('url')
    const [validationError, setValidationError] = useState('')

    // WiFi form fields
    const [ssid, setSsid] = useState('')
    const [password, setPassword] = useState('')
    const [encryption, setEncryption] = useState('WPA')
    const [hidden, setHidden] = useState(false)

    // Email form fields
    const [email, setEmail] = useState('')
    const [subject, setSubject] = useState('')
    const [emailBody, setEmailBody] = useState('')

    // Phone form fields
    const [phoneNumber, setPhoneNumber] = useState('')

    // Character limits
    const TEXT_MAX_LENGTH = 300
    const URL_MAX_LENGTH = 500
    const EMAIL_BODY_MAX_LENGTH = 200
    const SUBJECT_MAX_LENGTH = 100

    const qrRef = useRef(null)

    // Reset validation error when input changes
    useEffect(() => {
        if (validationError) {
            setValidationError('')
        }
        // eslint-disable-next-line
    }, [input, ssid, password, email, subject, emailBody, phoneNumber])

    // Hide success message after 3 seconds
    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => {
                setShowSuccess(false)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [showSuccess])

    const handleInputChange = (e) => {
        setInput(e.target.value)
    }

    const validateInput = () => {
        // Common validation for empty inputs
        if (activeTab === 'url' && !input.trim()) {
            setValidationError('Please enter a URL')
            return false
        } else if (activeTab === 'text' && !input.trim()) {
            setValidationError('Please enter some text')
            return false
        } else if (activeTab === 'wifi' && !ssid.trim()) {
            setValidationError('Please enter a network name (SSID)')
            return false
        } else if (activeTab === 'email' && !email.trim()) {
            setValidationError('Please enter an email address')
            return false
        } else if (activeTab === 'phone' && !phoneNumber.trim()) {
            setValidationError('Please enter a phone number')
            return false
        }

        // Length validation
        if (activeTab === 'url' && input.length > URL_MAX_LENGTH) {
            setValidationError(
                `URL is too long (maximum ${URL_MAX_LENGTH} characters)`
            )
            return false
        } else if (activeTab === 'text' && input.length > TEXT_MAX_LENGTH) {
            setValidationError(
                `Text is too long (maximum ${TEXT_MAX_LENGTH} characters)`
            )
            return false
        } else if (
            activeTab === 'email' &&
            emailBody.length > EMAIL_BODY_MAX_LENGTH
        ) {
            setValidationError(
                `Email body is too long (maximum ${EMAIL_BODY_MAX_LENGTH} characters)`
            )
            return false
        } else if (
            activeTab === 'email' &&
            subject.length > SUBJECT_MAX_LENGTH
        ) {
            setValidationError(
                `Subject is too long (maximum ${SUBJECT_MAX_LENGTH} characters)`
            )
            return false
        }

        // Format validation
        if (activeTab === 'url') {
            try {
                // Simple URL validation
                new URL(input)
            } catch (e) {
                setValidationError(
                    'Please enter a valid URL (include http:// or https://)'
                )
                return false
            }
        } else if (activeTab === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(email)) {
                setValidationError('Please enter a valid email address')
                return false
            }
        } else if (activeTab === 'phone') {
            // Basic phone number validation (allows various formats)
            const phoneRegex =
                /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
            if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
                setValidationError('Please enter a valid phone number')
                return false
            }
        }

        return true
    }

    const generateQRCode = () => {
        if (!validateInput()) return

        setIsGenerating(true)

        // Simulate processing time
        setTimeout(() => {
            let finalValue = ''

            switch (activeTab) {
                case 'url':
                    finalValue = input
                    break
                case 'text':
                    finalValue = input
                    break
                case 'wifi':
                    // Format: WIFI:T:<encryption>;S:<ssid>;P:<password>;H:<hidden>;;
                    finalValue = `WIFI:T:${encryption};S:${ssid};P:${password};H:${
                        hidden ? 'true' : 'false'
                    };;`
                    break
                case 'email':
                    // Format: mailto:<email>?subject=<subject>&body=<body>
                    finalValue = `mailto:${email}`
                    if (subject)
                        finalValue += `?subject=${encodeURIComponent(subject)}`
                    if (emailBody)
                        finalValue += `${
                            subject ? '&' : '?'
                        }body=${encodeURIComponent(emailBody)}`
                    break
                case 'phone':
                    // Format: tel:<phone>
                    finalValue = `tel:${phoneNumber.replace(/\s/g, '')}`
                    break
                default:
                    finalValue = input
            }

            setQrValue(finalValue)
            setIsGenerating(false)
            setShowSuccess(true)
        }, 500)
    }

    const downloadQRCode = () => {
        if (!qrValue) return

        const svg = qrRef.current
        const svgData = new XMLSerializer().serializeToString(svg)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()

        img.onload = () => {
            canvas.width = size
            canvas.height = size
            ctx.fillStyle = bgColor
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, 0, 0)

            const pngFile = canvas.toDataURL('image/png')
            const downloadLink = document.createElement('a')

            downloadLink.download = `qrcode-${activeTab}.png`
            downloadLink.href = pngFile
            downloadLink.click()
        }

        img.src =
            'data:image/svg+xml;base64,' +
            btoa(unescape(encodeURIComponent(svgData)))
    }

    const handleTabChange = (key) => {
        setActiveTab(key)
        setInput('')
        setQrValue('')
        setSsid('')
        setPassword('')
        setEmail('')
        setSubject('')
        setEmailBody('')
        setPhoneNumber('')
        setValidationError('')
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'url':
                return (
                    <Form.Group className="mb-3">
                        <Form.Label>Enter URL</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="https://example.com"
                            value={input}
                            onChange={handleInputChange}
                            isInvalid={!!validationError}
                            maxLength={URL_MAX_LENGTH}
                        />
                        <Form.Control.Feedback type="invalid">
                            {validationError}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                            Enter a valid URL including http:// or https:// (max{' '}
                            {URL_MAX_LENGTH} characters)
                        </Form.Text>
                    </Form.Group>
                )
            case 'text':
                return (
                    <Form.Group className="mb-3">
                        <Form.Label>Enter Text</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter text to encode in QR code"
                            value={input}
                            onChange={handleInputChange}
                            isInvalid={!!validationError}
                            maxLength={TEXT_MAX_LENGTH}
                        />
                        <Form.Control.Feedback type="invalid">
                            {validationError}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                            {input.length}/{TEXT_MAX_LENGTH} characters
                        </Form.Text>
                    </Form.Group>
                )
            case 'wifi':
                return (
                    <>
                        <Form.Group className="mb-3">
                            <Form.Label>Network Name (SSID)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Your WiFi Network Name"
                                value={ssid}
                                onChange={(e) => setSsid(e.target.value)}
                                isInvalid={!!validationError && !ssid.trim()}
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationError}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="WiFi Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Form.Text className="text-muted">
                                Leave blank for open networks
                            </Form.Text>
                        </Form.Group>
                        <Row className="mb-3">
                            <Col sm={6}>
                                <Form.Group>
                                    <Form.Label>Encryption Type</Form.Label>
                                    <Form.Select
                                        value={encryption}
                                        onChange={(e) =>
                                            setEncryption(e.target.value)
                                        }
                                    >
                                        <option value="WPA">WPA/WPA2</option>
                                        <option value="WEP">WEP</option>
                                        <option value="nopass">None</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mt-sm-4 pt-sm-2">
                                    <Form.Check
                                        type="checkbox"
                                        label="Hidden Network"
                                        checked={hidden}
                                        onChange={(e) =>
                                            setHidden(e.target.checked)
                                        }
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </>
                )
            case 'email':
                return (
                    <>
                        <Form.Group className="mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="example@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                isInvalid={!!validationError && !email.trim()}
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationError}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Subject (Optional)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Email Subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                maxLength={SUBJECT_MAX_LENGTH}
                                isInvalid={
                                    !!validationError &&
                                    subject.length > SUBJECT_MAX_LENGTH
                                }
                            />
                            <Form.Text className="text-muted">
                                {subject.length}/{SUBJECT_MAX_LENGTH} characters
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Body (Optional)</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                placeholder="Email Body"
                                value={emailBody}
                                onChange={(e) => setEmailBody(e.target.value)}
                                maxLength={EMAIL_BODY_MAX_LENGTH}
                                isInvalid={
                                    !!validationError &&
                                    emailBody.length > EMAIL_BODY_MAX_LENGTH
                                }
                            />
                            <Form.Text className="text-muted">
                                {emailBody.length}/{EMAIL_BODY_MAX_LENGTH}{' '}
                                characters
                            </Form.Text>
                        </Form.Group>
                    </>
                )
            case 'phone':
                return (
                    <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                            type="tel"
                            placeholder="+1 (123) 456-7890"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            isInvalid={!!validationError}
                        />
                        <Form.Control.Feedback type="invalid">
                            {validationError}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                            Enter a phone number with country code (e.g., +1 for
                            US)
                        </Form.Text>
                    </Form.Group>
                )
            default:
                return null
        }
    }

    return (
        <Container className="qr-generator-container">
            <h1 className="text-center mb-4">QR Code Generator</h1>

            {showSuccess && (
                <Alert variant="success" className="text-center">
                    QR Code generated successfully!
                </Alert>
            )}

            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Tabs
                                activeKey={activeTab}
                                onSelect={handleTabChange}
                                className="mb-4"
                            >
                                <Tab
                                    eventKey="url"
                                    title={
                                        <span className="tab-title">URL</span>
                                    }
                                />
                                <Tab
                                    eventKey="text"
                                    title={
                                        <span className="tab-title">Text</span>
                                    }
                                />
                                <Tab
                                    eventKey="wifi"
                                    title={
                                        <span className="tab-title">WiFi</span>
                                    }
                                />
                                <Tab
                                    eventKey="email"
                                    title={
                                        <span className="tab-title">Email</span>
                                    }
                                />
                                <Tab
                                    eventKey="phone"
                                    title={
                                        <span className="tab-title">Phone</span>
                                    }
                                />
                            </Tabs>

                            {renderTabContent()}

                            <div className="mb-4">
                                <h5>Customization</h5>
                                <Row>
                                    <Col sm={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Size</Form.Label>
                                            <Form.Range
                                                min={128}
                                                max={512}
                                                step={8}
                                                value={size}
                                                onChange={(e) =>
                                                    setSize(
                                                        Number(e.target.value)
                                                    )
                                                }
                                            />
                                            <div className="d-flex justify-content-between">
                                                <small>Small</small>
                                                <small>{size}px</small>
                                                <small>Large</small>
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>
                                                Error Correction
                                            </Form.Label>
                                            <Form.Select
                                                value={errorLevel}
                                                onChange={(e) =>
                                                    setErrorLevel(
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="L">
                                                    Low (7%)
                                                </option>
                                                <option value="M">
                                                    Medium (15%)
                                                </option>
                                                <option value="Q">
                                                    Quartile (25%)
                                                </option>
                                                <option value="H">
                                                    High (30%)
                                                </option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col sm={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>
                                                Background Color
                                            </Form.Label>
                                            <div className="d-flex">
                                                <Form.Control
                                                    type="color"
                                                    value={bgColor}
                                                    onChange={(e) =>
                                                        setBgColor(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="me-2"
                                                />
                                                <Form.Control
                                                    type="text"
                                                    value={bgColor}
                                                    onChange={(e) =>
                                                        setBgColor(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>
                                                Foreground Color
                                            </Form.Label>
                                            <div className="d-flex">
                                                <Form.Control
                                                    type="color"
                                                    value={fgColor}
                                                    onChange={(e) =>
                                                        setFgColor(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="me-2"
                                                />
                                                <Form.Control
                                                    type="text"
                                                    value={fgColor}
                                                    onChange={(e) =>
                                                        setFgColor(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        label="Include margin"
                                        checked={includeMargin}
                                        onChange={(e) =>
                                            setIncludeMargin(e.target.checked)
                                        }
                                    />
                                </Form.Group>
                            </div>

                            <div className="d-grid gap-2">
                                <Button
                                    variant="primary"
                                    onClick={generateQRCode}
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                            <span className="ms-2">
                                                Generating...
                                            </span>
                                        </>
                                    ) : (
                                        'Generate QR Code'
                                    )}
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={8} lg={6} className="mt-4 mt-lg-0">
                    <Card className="shadow-sm h-100">
                        <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                            {qrValue ? (
                                <>
                                    <div className="qr-code-container mb-4">
                                        <QRCodeSVG
                                            ref={qrRef}
                                            value={qrValue}
                                            size={size}
                                            bgColor={bgColor}
                                            fgColor={fgColor}
                                            level={errorLevel}
                                            includeMargin={includeMargin}
                                        />
                                    </div>
                                    <div className="d-grid gap-2 w-100">
                                        <Button
                                            variant="success"
                                            onClick={downloadQRCode}
                                        >
                                            Download QR Code
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-muted empty-state">
                                    <i className="qr-icon mb-3"></i>
                                    <h4>Ready to Generate</h4>
                                    <p>Your QR code will appear here</p>
                                    <p className="small">
                                        Fill in the form and click "Generate QR
                                        Code"
                                    </p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <div className="mt-5">
                <h4>About QR Codes</h4>
                <p>
                    QR codes (Quick Response codes) are two-dimensional barcodes
                    that can store various types of information. They are widely
                    used for sharing URLs, contact information, Wi-Fi
                    credentials, and more.
                </p>
                <h5>Tips for QR Code Usage:</h5>
                <ul>
                    <li>
                        Higher error correction levels make QR codes more
                        reliable but larger
                    </li>
                    <li>
                        Ensure good contrast between foreground and background
                        colors
                    </li>
                    <li>
                        Test your QR code with different devices before
                        distributing
                    </li>
                    <li>
                        Keep the encoded data concise for better scanning
                        performance
                    </li>
                    <li>
                        For text QR codes, keep content under {TEXT_MAX_LENGTH}{' '}
                        characters for optimal scanning
                    </li>
                </ul>

                {/* Attribution section */}
                <div className="mt-4 p-3 bg-light rounded">
                    <h5>Attribution</h5>
                    <p className="small text-muted mb-0">
                        This QR code generator uses the{' '}
                        <a
                            href="https://github.com/zpao/qrcode.react"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            qrcode.react
                        </a>{' '}
                        library, which is licensed under the ISC License.
                    </p>
                </div>
            </div>
        </Container>
    )
}

export default QRCodeGenerator
