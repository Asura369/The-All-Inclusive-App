import React, { useState } from 'react'
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    InputGroup,
    Button,
    Tab,
    Nav,
    Alert
} from 'react-bootstrap'
import './UnitConverter.css'

// Conversion factors for different unit types
const conversionFactors = {
    length: {
        meter: 1,
        kilometer: 0.001,
        centimeter: 100,
        millimeter: 1000,
        mile: 0.000621371,
        yard: 1.09361,
        foot: 3.28084,
        inch: 39.3701
    },
    weight: {
        kilogram: 1,
        gram: 1000,
        milligram: 1000000,
        pound: 2.20462,
        ounce: 35.274,
        ton: 0.001,
        stone: 0.157473
    },
    temperature: {
        celsius: 'base',
        fahrenheit: 'special',
        kelvin: 'special'
    },
    area: {
        'square meter': 1,
        'square kilometer': 0.000001,
        'square centimeter': 10000,
        'square millimeter': 1000000,
        hectare: 0.0001,
        acre: 0.000247105,
        'square mile': 3.86102e-7,
        'square foot': 10.7639,
        'square inch': 1550
    },
    volume: {
        'cubic meter': 1,
        liter: 1000,
        milliliter: 1000000,
        'cubic foot': 35.3147,
        'cubic inch': 61023.7,
        'US gallon': 264.172,
        'US quart': 1056.69,
        'US pint': 2113.38,
        'US cup': 4226.75,
        'US fluid ounce': 33814,
        'US tablespoon': 67628,
        'US teaspoon': 202884
    },
    time: {
        second: 1,
        millisecond: 1000,
        minute: 1 / 60,
        hour: 1 / 3600,
        day: 1 / 86400,
        week: 1 / 604800,
        month: 1 / 2592000,
        year: 1 / 31536000
    },
    speed: {
        'meter/second': 1,
        'kilometer/hour': 3.6,
        'mile/hour': 2.23694,
        knot: 1.94384,
        'foot/second': 3.28084
    },
    data: {
        bit: 1,
        byte: 0.125,
        kilobit: 0.001,
        kilobyte: 0.000125,
        megabit: 0.000001,
        megabyte: 0.000000125,
        gigabit: 1e-9,
        gigabyte: 1.25e-10,
        terabit: 1e-12,
        terabyte: 1.25e-13
    }
}

const UnitConverter = () => {
    const [category, setCategory] = useState('length')
    const [fromUnit, setFromUnit] = useState(
        Object.keys(conversionFactors.length)[0]
    )
    const [toUnit, setToUnit] = useState(
        Object.keys(conversionFactors.length)[1]
    )
    const [fromValue, setFromValue] = useState('1')
    const [toValue, setToValue] = useState('')
    const [error, setError] = useState('')
    const [copied, setCopied] = useState(false)

    // Handle category change
    const handleCategoryChange = (newCategory) => {
        setCategory(newCategory)
        const units = Object.keys(conversionFactors[newCategory])
        setFromUnit(units[0])
        setToUnit(units[1])
        setFromValue('1')
        setToValue('')
        setError('')
    }

    // Convert between units
    const convert = () => {
        setError('')

        if (!fromValue.trim()) {
            setToValue('')
            return
        }

        try {
            const numValue = parseFloat(fromValue)

            if (isNaN(numValue)) {
                setError('Please enter a valid number')
                setToValue('')
                return
            }

            // Special case for temperature
            if (category === 'temperature') {
                setToValue(convertTemperature(numValue, fromUnit, toUnit))
                return
            }

            // For other units
            const baseValue = numValue / conversionFactors[category][fromUnit]
            const result = baseValue * conversionFactors[category][toUnit]

            // Format the result based on its magnitude
            setToValue(formatResult(result))
        } catch (err) {
            setError('Conversion error: ' + err.message)
            setToValue('')
        }
    }

    // Special temperature conversion
    const convertTemperature = (value, from, to) => {
        let result

        // Convert to Celsius first (as base unit)
        let celsius
        if (from === 'celsius') {
            celsius = value
        } else if (from === 'fahrenheit') {
            celsius = ((value - 32) * 5) / 9
        } else if (from === 'kelvin') {
            celsius = value - 273.15
        }

        // Convert from Celsius to target unit
        if (to === 'celsius') {
            result = celsius
        } else if (to === 'fahrenheit') {
            result = (celsius * 9) / 5 + 32
        } else if (to === 'kelvin') {
            result = celsius + 273.15
        }

        return formatResult(result)
    }

    // Format result based on its magnitude
    const formatResult = (value) => {
        if (Math.abs(value) < 0.000001 && value !== 0) {
            return value.toExponential(6)
        } else if (Math.abs(value) >= 1000000) {
            return value.toExponential(6)
        } else {
            // Use a reasonable number of decimal places
            return value.toPrecision(8).replace(/\.?0+$/, '')
        }
    }

    // Swap units
    const swapUnits = () => {
        const tempUnit = fromUnit
        setFromUnit(toUnit)
        setToUnit(tempUnit)

        const tempValue = fromValue
        setFromValue(toValue)
        setToValue(tempValue)
    }

    // Copy result to clipboard
    const copyToClipboard = () => {
        if (!toValue) return

        navigator.clipboard.writeText(toValue).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }

    // Handle input change and auto-convert
    const handleInputChange = (e) => {
        setFromValue(e.target.value)
        // Auto-convert if the input is valid
        if (e.target.value.trim() && !isNaN(parseFloat(e.target.value))) {
            convert()
        } else {
            setToValue('')
        }
    }

    return (
        <Container className="unit-converter-container">
            <h1 className="text-center mb-4">Unit Converter</h1>

            <Tab.Container id="unit-categories" defaultActiveKey="length">
                <Row className="mb-4">
                    <Col>
                        <Card className="category-card">
                            <Card.Body>
                                <Nav variant="pills" className="category-nav">
                                    <Nav.Item>
                                        <Nav.Link
                                            eventKey="length"
                                            onClick={() =>
                                                handleCategoryChange('length')
                                            }
                                        >
                                            Length
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link
                                            eventKey="weight"
                                            onClick={() =>
                                                handleCategoryChange('weight')
                                            }
                                        >
                                            Weight
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link
                                            eventKey="temperature"
                                            onClick={() =>
                                                handleCategoryChange(
                                                    'temperature'
                                                )
                                            }
                                        >
                                            Temperature
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link
                                            eventKey="area"
                                            onClick={() =>
                                                handleCategoryChange('area')
                                            }
                                        >
                                            Area
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link
                                            eventKey="volume"
                                            onClick={() =>
                                                handleCategoryChange('volume')
                                            }
                                        >
                                            Volume
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link
                                            eventKey="time"
                                            onClick={() =>
                                                handleCategoryChange('time')
                                            }
                                        >
                                            Time
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link
                                            eventKey="speed"
                                            onClick={() =>
                                                handleCategoryChange('speed')
                                            }
                                        >
                                            Speed
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link
                                            eventKey="data"
                                            onClick={() =>
                                                handleCategoryChange('data')
                                            }
                                        >
                                            Data
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Tab.Content>
                    <Tab.Pane eventKey={category} active>
                        <Card className="converter-card">
                            <Card.Body>
                                <Row>
                                    <Col md={5}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>From</Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    type="text"
                                                    value={fromValue}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter value"
                                                />
                                                <Form.Select
                                                    value={fromUnit}
                                                    onChange={(e) => {
                                                        setFromUnit(
                                                            e.target.value
                                                        )
                                                        convert()
                                                    }}
                                                >
                                                    {Object.keys(
                                                        conversionFactors[
                                                            category
                                                        ]
                                                    ).map((unit) => (
                                                        <option
                                                            key={unit}
                                                            value={unit}
                                                        >
                                                            {unit}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>

                                    <Col
                                        md={2}
                                        className="d-flex align-items-center justify-content-center my-2"
                                    >
                                        <Button
                                            variant="outline-secondary"
                                            onClick={swapUnits}
                                            className="swap-btn"
                                        >
                                            ⇄
                                        </Button>
                                    </Col>

                                    <Col md={5}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>To</Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    type="text"
                                                    value={toValue}
                                                    readOnly
                                                    placeholder="Result"
                                                />
                                                <Form.Select
                                                    value={toUnit}
                                                    onChange={(e) => {
                                                        setToUnit(
                                                            e.target.value
                                                        )
                                                        convert()
                                                    }}
                                                >
                                                    {Object.keys(
                                                        conversionFactors[
                                                            category
                                                        ]
                                                    ).map((unit) => (
                                                        <option
                                                            key={unit}
                                                            value={unit}
                                                        >
                                                            {unit}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                                <Button
                                                    variant="secondary"
                                                    onClick={copyToClipboard}
                                                    disabled={!toValue}
                                                    className="copy-btn"
                                                >
                                                    {copied ? '✓' : 'Copy'}
                                                </Button>
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {error && (
                                    <Alert variant="danger" className="mt-3">
                                        {error}
                                    </Alert>
                                )}

                                <div className="text-center mt-3">
                                    <Button
                                        variant="primary"
                                        onClick={convert}
                                        className="convert-btn"
                                        size="lg"
                                    >
                                        Convert
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>

            <Row className="mt-4">
                <Col>
                    <Card className="info-card">
                        <Card.Body>
                            <h5>About Unit Converter</h5>
                            <p>
                                This tool allows you to convert between
                                different units of measurement across various
                                categories. Simply select a category, choose
                                your units, enter a value, and get the
                                conversion result instantly.
                            </p>
                            <p className="mb-0 small text-muted">
                                Built with React Bootstrap. All calculations are
                                performed locally in your browser. No data is
                                sent to any server.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default UnitConverter
