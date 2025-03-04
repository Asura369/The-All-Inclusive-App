import React, { useState, useEffect } from 'react'
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    Alert,
    ListGroup
} from 'react-bootstrap'
import './AgeCalculator.css'

const AgeCalculator = () => {
    const [birthDate, setBirthDate] = useState('')
    const [calculationDate, setCalculationDate] = useState('')
    const [useCurrentDate, setUseCurrentDate] = useState(true)
    const [age, setAge] = useState(null)
    const [error, setError] = useState('')
    const [showResult, setShowResult] = useState(false)
    const [nextBirthday, setNextBirthday] = useState(null)
    const [fractionalAge, setFractionalAge] = useState(null)

    // Set today's date as the default calculation date
    useEffect(() => {
        const today = new Date()
        const formattedDate = formatDateForInput(today)
        setCalculationDate(formattedDate)
    }, [])

    // Helper function to format date for input field
    const formatDateForInput = (date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    // Handle birth date change
    const handleBirthDateChange = (e) => {
        setBirthDate(e.target.value)
        setError('')
        setShowResult(false)
    }

    // Handle calculation date change
    const handleCalculationDateChange = (e) => {
        setCalculationDate(e.target.value)
        setError('')
        setShowResult(false)
    }

    // Toggle between current date and custom date
    const handleDateToggle = (e) => {
        setUseCurrentDate(e.target.checked)
        if (e.target.checked) {
            const today = new Date()
            setCalculationDate(formatDateForInput(today))
        }
        setShowResult(false)
    }

    // Calculate age
    const calculateAge = () => {
        setError('')

        if (!birthDate) {
            setError('Please enter your birth date')
            return
        }

        const birthDateObj = new Date(birthDate)
        const calcDateObj = useCurrentDate
            ? new Date()
            : new Date(calculationDate)

        // Validate dates
        if (isNaN(birthDateObj.getTime())) {
            setError('Invalid birth date')
            return
        }

        if (!useCurrentDate && isNaN(calcDateObj.getTime())) {
            setError('Invalid calculation date')
            return
        }

        // Check if birth date is in the future
        if (birthDateObj > new Date()) {
            setError('Birth date cannot be in the future')
            return
        }

        // Check if calculation date is before birth date
        if (calcDateObj < birthDateObj) {
            setError('Calculation date cannot be before birth date')
            return
        }

        // Calculate age
        const ageDetails = calculateAgeDetails(birthDateObj, calcDateObj)
        setAge(ageDetails)

        // Calculate fractional age
        const fractionalAgeValue = calculateFractionalAge(
            birthDateObj,
            calcDateObj
        )
        setFractionalAge(fractionalAgeValue)

        // Calculate next birthday
        const nextBirthdayInfo = calculateNextBirthday(
            birthDateObj,
            calcDateObj
        )
        setNextBirthday(nextBirthdayInfo)

        setShowResult(true)
    }

    // Calculate detailed age
    const calculateAgeDetails = (birthDate, calcDate) => {
        const birthYear = birthDate.getFullYear()
        const birthMonth = birthDate.getMonth()
        const birthDay = birthDate.getDate()

        const calcYear = calcDate.getFullYear()
        const calcMonth = calcDate.getMonth()
        const calcDay = calcDate.getDate()

        let years = calcYear - birthYear
        let months = calcMonth - birthMonth
        let days = calcDay - birthDay

        // Adjust months and years if days are negative
        if (days < 0) {
            months -= 1
            // Get the last day of the previous month
            const lastDayOfLastMonth = new Date(
                calcYear,
                calcMonth,
                0
            ).getDate()
            days += lastDayOfLastMonth
        }

        // Adjust years if months are negative
        if (months < 0) {
            years -= 1
            months += 12
        }

        // Calculate total values
        const totalMonths = years * 12 + months

        // Calculate approximate values
        const totalDays = Math.floor(
            (calcDate - birthDate) / (1000 * 60 * 60 * 24)
        )
        const totalWeeks = Math.floor(totalDays / 7)
        const totalHours = totalDays * 24

        return {
            years,
            months,
            days,
            totalMonths,
            totalWeeks,
            totalDays,
            totalHours
        }
    }

    // Calculate fractional age
    const calculateFractionalAge = (birthDate, calcDate) => {
        // Get milliseconds between dates
        const ageInMs = calcDate.getTime() - birthDate.getTime()

        // Convert to years (accounting for leap years)
        // Average year length: 365.25 days
        const msInYear = 365.25 * 24 * 60 * 60 * 1000
        const ageInYears = ageInMs / msInYear

        return {
            exact: ageInYears,
            formatted: ageInYears.toFixed(8),
            display: ageInYears.toFixed(6)
        }
    }

    // Calculate next birthday
    const calculateNextBirthday = (birthDate, calcDate) => {
        const birthMonth = birthDate.getMonth()
        const birthDay = birthDate.getDate()

        let nextBirthdayYear = calcDate.getFullYear()

        // Create a date object for this year's birthday
        const thisBirthday = new Date(nextBirthdayYear, birthMonth, birthDay)

        // If this year's birthday has passed, calculate for next year
        if (calcDate > thisBirthday) {
            nextBirthdayYear += 1
        }

        // Create the next birthday date, ensuring we use the correct day
        const nextBirthdayDate = new Date(
            nextBirthdayYear,
            birthMonth,
            birthDay
        )

        // Calculate days until next birthday
        const daysUntil = Math.ceil(
            (nextBirthdayDate - calcDate) / (1000 * 60 * 60 * 24)
        )

        // Calculate which birthday it will be
        const birthdayNumber = nextBirthdayYear - birthDate.getFullYear()

        return {
            date: nextBirthdayDate,
            daysUntil,
            birthdayNumber
        }
    }

    // Format date for display
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <Container className="age-calculator-container">
            <h1 className="text-center mb-4">Age Calculator</h1>

            <Row className="justify-content-center">
                <Col md={10} lg={8}>
                    <Card className="shadow-sm mb-4">
                        <Card.Body>
                            <Form>
                                <Form.Group className="mb-4">
                                    <Form.Label>Date of Birth</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={birthDate}
                                        onChange={handleBirthDateChange}
                                        max={formatDateForInput(new Date())}
                                        isInvalid={!!error && !birthDate}
                                    />
                                    <Form.Text className="text-muted">
                                        Enter your birth date to calculate your
                                        age
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="switch"
                                        id="current-date-switch"
                                        label="Use current date"
                                        checked={useCurrentDate}
                                        onChange={handleDateToggle}
                                    />
                                </Form.Group>

                                {!useCurrentDate && (
                                    <Form.Group className="mb-4">
                                        <Form.Label>
                                            Calculate Age At
                                        </Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={calculationDate}
                                            onChange={
                                                handleCalculationDateChange
                                            }
                                            isInvalid={
                                                !!error && !calculationDate
                                            }
                                        />
                                        <Form.Text className="text-muted">
                                            Select a date to calculate your age
                                            at that point
                                        </Form.Text>
                                    </Form.Group>
                                )}

                                {error && (
                                    <Alert variant="danger" className="mt-3">
                                        {error}
                                    </Alert>
                                )}

                                <div className="d-grid gap-2 mt-4">
                                    <Button
                                        variant="primary"
                                        onClick={calculateAge}
                                        size="lg"
                                    >
                                        Calculate Age
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>

                    {showResult && age && (
                        <div className="results-section">
                            <Card className="shadow-sm mb-4 result-card">
                                <Card.Header as="h5" className="text-center">
                                    Your Age
                                </Card.Header>
                                <Card.Body>
                                    <div className="age-display text-center mb-4">
                                        <span className="age-years">
                                            {age.years}
                                        </span>
                                        <span className="age-label">years</span>
                                        <span className="age-months">
                                            {age.months}
                                        </span>
                                        <span className="age-label">
                                            months
                                        </span>
                                        <span className="age-days">
                                            {age.days}
                                        </span>
                                        <span className="age-label">days</span>
                                    </div>

                                    <p className="text-center text-muted mb-4">
                                        {useCurrentDate
                                            ? 'As of today'
                                            : `As of ${formatDate(
                                                  calculationDate
                                              )}`}
                                    </p>

                                    {fractionalAge && (
                                        <div className="fractional-age text-center mb-4">
                                            <h6>Exact Age in Years</h6>
                                            <div className="fractional-display">
                                                {fractionalAge.display}
                                            </div>
                                            <p className="text-muted small">
                                                Your age as a decimal number
                                            </p>
                                        </div>
                                    )}

                                    <h6 className="mt-4 mb-3">
                                        Age in Different Units
                                    </h6>
                                    <ListGroup
                                        variant="flush"
                                        className="age-details"
                                    >
                                        <ListGroup.Item className="d-flex justify-content-between">
                                            <span>Total Months:</span>
                                            <strong>
                                                {age.totalMonths.toLocaleString()}{' '}
                                                months
                                            </strong>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="d-flex justify-content-between">
                                            <span>Total Weeks:</span>
                                            <strong>
                                                {age.totalWeeks.toLocaleString()}{' '}
                                                weeks
                                            </strong>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="d-flex justify-content-between">
                                            <span>Total Days:</span>
                                            <strong>
                                                {age.totalDays.toLocaleString()}{' '}
                                                days
                                            </strong>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="d-flex justify-content-between">
                                            <span>Total Hours:</span>
                                            <strong>
                                                {age.totalHours.toLocaleString()}{' '}
                                                hours
                                            </strong>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Card.Body>
                            </Card>

                            {nextBirthday && (
                                <Card className="shadow-sm birthday-card">
                                    <Card.Header
                                        as="h5"
                                        className="text-center"
                                    >
                                        Next Birthday
                                    </Card.Header>
                                    <Card.Body className="text-center">
                                        <p className="birthday-number">
                                            You will be{' '}
                                            <span>
                                                {nextBirthday.birthdayNumber}
                                            </span>{' '}
                                            years old
                                        </p>
                                        <p className="birthday-date">
                                            on {formatDate(nextBirthday.date)}
                                        </p>
                                        <div className="countdown-display">
                                            <span className="countdown-number">
                                                {nextBirthday.daysUntil}
                                            </span>
                                            <span className="countdown-label">
                                                days from{' '}
                                                {useCurrentDate
                                                    ? 'today'
                                                    : formatDate(
                                                          calculationDate
                                                      )}
                                            </span>
                                        </div>
                                    </Card.Body>
                                </Card>
                            )}
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    )
}

export default AgeCalculator
