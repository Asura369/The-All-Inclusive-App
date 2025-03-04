import React, { useState, useEffect } from 'react'
import {
    Container,
    Form,
    Button,
    Row,
    Col,
    Card,
    Alert,
    Badge,
    ListGroup
} from 'react-bootstrap'
import { FaCopy, FaDownload, FaTrash } from 'react-icons/fa'
import { FaPlus, FaShuffle } from 'react-icons/fa6'
import './DataGenerator.css'

const DataGenerator = () => {
    // State for form inputs
    const [dataType, setDataType] = useState('string')
    const [count, setCount] = useState(10)
    const [minValue, setMinValue] = useState(1)
    const [maxValue, setMaxValue] = useState(100)
    const [stringLength, setStringLength] = useState(8)
    const [includeUppercase, setIncludeUppercase] = useState(true)
    const [includeLowercase, setIncludeLowercase] = useState(true)
    const [includeNumbers, setIncludeNumbers] = useState(true)
    const [includeSpecial, setIncludeSpecial] = useState(false)
    const [customCharset, setCustomCharset] = useState('')
    const [useCustomCharset, setUseCustomCharset] = useState(false)
    const [stringGenerationType, setStringGenerationType] = useState('random')
    const [customWords, setCustomWords] = useState('')
    const [customWordsSeparator, setCustomWordsSeparator] = useState('comma')
    const [decimalPlaces, setDecimalPlaces] = useState(2)
    const [separator, setSeparator] = useState('newline')
    const [prefix, setPrefix] = useState('')
    const [suffix, setSuffix] = useState('')
    const [booleanType, setBooleanType] = useState('random')
    const [dateFormat, setDateFormat] = useState('YYYY-MM-DD')

    // Custom date format options
    const [dateDelimiter, setDateDelimiter] = useState('-')
    const [dateOrder, setDateOrder] = useState('YMD')

    // State for generated list
    const [generatedList, setGeneratedList] = useState([])
    const [generatedItems, setGeneratedItems] = useState([])
    const [copySuccess, setCopySuccess] = useState('')
    const [error, setError] = useState('')

    // English words for random word generation
    const wordsList = [
        'time',
        'person',
        'year',
        'way',
        'day',
        'thing',
        'man',
        'world',
        'life',
        'hand',
        'part',
        'child',
        'eye',
        'woman',
        'place',
        'work',
        'week',
        'case',
        'point',
        'government',
        'company',
        'number',
        'group',
        'problem',
        'fact',
        'be',
        'have',
        'do',
        'say',
        'get',
        'make',
        'go',
        'know',
        'take',
        'see',
        'come',
        'think',
        'look',
        'want',
        'give',
        'use',
        'find',
        'tell',
        'ask',
        'work',
        'seem',
        'feel',
        'try',
        'leave',
        'call',
        'good',
        'new',
        'first',
        'last',
        'long',
        'great',
        'little',
        'own',
        'other',
        'old',
        'right',
        'big',
        'high',
        'different',
        'small',
        'large',
        'next',
        'early',
        'young',
        'important',
        'few',
        'public',
        'bad',
        'same',
        'able',
        'to',
        'of',
        'in',
        'for',
        'on',
        'with',
        'at',
        'by',
        'from',
        'up',
        'about',
        'into',
        'over',
        'after',
        'beneath',
        'under',
        'above',
        'the',
        'and',
        'a',
        'that',
        'I',
        'it',
        'not',
        'he',
        'as',
        'you',
        'this',
        'but',
        'his',
        'they',
        'her',
        'she',
        'or',
        'an',
        'will',
        'my',
        'one',
        'all',
        'would',
        'there',
        'their',
        'what',
        'so',
        'out',
        'if',
        'who',
        'which',
        'when',
        'made',
        'can',
        'like',
        'time',
        'just',
        'him',
        'know',
        'take',
        'people',
        'into',
        'year',
        'your',
        'good',
        'some',
        'could',
        'them',
        'see',
        'other',
        'than',
        'then',
        'now',
        'look',
        'only',
        'come',
        'its',
        'over',
        'think',
        'also',
        'back',
        'after',
        'use',
        'two',
        'how',
        'our',
        'work',
        'first',
        'well',
        'way',
        'even',
        'new',
        'want',
        'because',
        'any',
        'these',
        'give',
        'day',
        'most',
        'us',
        'information',
        'system',
        'better',
        'always',
        'between',
        'never',
        'money',
        'health',
        'business',
        'service',
        'school',
        'program',
        'keep',
        'family',
        'learn',
        'house',
        'food',
        'power',
        'water',
        'room',
        'market',
        'student',
        'friend',
        'father',
        'mother',
        'doctor',
        'patient',
        'artist',
        'teacher',
        'customer',
        'client',
        'player',
        'community',
        'leader',
        'research',
        'product',
        'building',
        'history',
        'parent',
        'activity',
        'story',
        'industry',
        'media',
        'thing',
        'result',
        'party',
        'country',
        'area',
        'event',
        'process',
        'mother',
        'voice',
        'police',
        'policy',
        'course',
        'change',
        'period',
        'society',
        'security',
        'experience',
        'level',
        'office',
        'support',
        'interest',
        'development',
        'education',
        'something',
        'someone'
    ]

    // Reset error message after 3 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError('')
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [error])

    // Reset copy success message after 3 seconds
    useEffect(() => {
        if (copySuccess) {
            const timer = setTimeout(() => {
                setCopySuccess('')
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [copySuccess])

    // Handle count changes with min/max limits
    const handleCountChange = (value) => {
        const parsedValue = parseInt(value) || 0
        if (parsedValue < 1) {
            setCount(1)
        } else if (parsedValue > 10000) {
            setCount(10000)
        } else {
            setCount(parsedValue)
        }
    }

    // Handle min value changes with validation
    const handleMinValueChange = (value) => {
        const parsedValue = parseFloat(value) || 0
        setMinValue(parsedValue)

        // If min is greater than max, adjust max
        if (parsedValue > maxValue) {
            setMaxValue(parsedValue)
        }
    }

    // Handle max value changes with validation
    const handleMaxValueChange = (value) => {
        const parsedValue = parseFloat(value) || 0

        // If max is less than min, use min value
        if (parsedValue < minValue) {
            setMaxValue(minValue)
        } else {
            setMaxValue(parsedValue)
        }
    }

    // Parse custom words based on selected separator
    const parseCustomWords = () => {
        if (!customWords.trim()) {
            return []
        }

        let words = []
        switch (customWordsSeparator) {
            case 'newline':
                words = customWords.split('\n')
                break
            case 'space':
                words = customWords.split(' ')
                break
            case 'tab':
                words = customWords.split('\t')
                break
            case 'comma':
            default:
                words = customWords.split(',')
                break
        }

        return words
            .map((word) => word.trim())
            .filter((word) => word.length > 0)
    }

    // Generate random string
    const generateRandomString = (length) => {
        // Check string generation type
        switch (stringGenerationType) {
            case 'english-words':
                // Use default English words list
                return wordsList[Math.floor(Math.random() * wordsList.length)]

            case 'custom-words':
                // Use custom words provided by the user
                const customWordsList = parseCustomWords()

                if (customWordsList.length === 0) {
                    // Fallback to random characters if no valid custom words
                    return generateRandomCharacters(length)
                }

                return customWordsList[
                    Math.floor(Math.random() * customWordsList.length)
                ]

            case 'random':
            default:
                // Generate random characters
                return generateRandomCharacters(length)
        }
    }

    // Generate random characters
    const generateRandomCharacters = (length) => {
        if (useCustomCharset) {
            if (customCharset.length === 0) {
                return 'abcdefghijklmnopqrstuvwxyz'.substring(0, length)
            }

            let result = ''
            for (let i = 0; i < length; i++) {
                result += customCharset.charAt(
                    Math.floor(Math.random() * customCharset.length)
                )
            }
            return result
        } else {
            let charset = ''
            if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
            if (includeNumbers) charset += '0123456789'
            if (includeSpecial) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'

            if (charset.length === 0) {
                charset = 'abcdefghijklmnopqrstuvwxyz'
            }

            let result = ''
            for (let i = 0; i < length; i++) {
                result += charset.charAt(
                    Math.floor(Math.random() * charset.length)
                )
            }
            return result
        }
    }

    // Generate random integer
    const generateRandomInt = (min, max) => {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    // Generate random float
    const generateRandomFloat = (min, max, decimals) => {
        // Limit decimals to a reasonable range (0-10) to prevent crashes
        const safeDecimals = Math.min(Math.max(0, decimals), 10)
        return parseFloat(
            (Math.random() * (max - min) + min).toFixed(safeDecimals)
        )
    }

    // Generate random boolean
    const generateRandomBoolean = () => {
        switch (booleanType) {
            case 'all-true':
                return true
            case 'all-false':
                return false
            case 'random':
            default:
                return Math.random() >= 0.5
        }
    }

    // Generate random date
    const generateRandomDate = (
        start = new Date(2000, 0, 1),
        end = new Date()
    ) => {
        const randomDate = new Date(
            start.getTime() + Math.random() * (end.getTime() - start.getTime())
        )

        // Format based on selected option
        if (dateFormat === 'ISO') {
            return randomDate.toISOString()
        } else if (dateFormat === 'MMMM D, YYYY') {
            const months = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ]
            return `${
                months[randomDate.getMonth()]
            } ${randomDate.getDate()}, ${randomDate.getFullYear()}`
        } else if (dateFormat === 'custom') {
            // Custom date formatting based on user preferences
            const year = randomDate.getFullYear()
            const month = (randomDate.getMonth() + 1)
                .toString()
                .padStart(2, '0')
            const day = randomDate.getDate().toString().padStart(2, '0')

            // Format based on selected order
            let formattedDate = ''
            switch (dateOrder) {
                case 'MDY':
                    formattedDate = `${month}${dateDelimiter}${day}${dateDelimiter}${year}`
                    break
                case 'DMY':
                    formattedDate = `${day}${dateDelimiter}${month}${dateDelimiter}${year}`
                    break
                case 'YMD':
                default:
                    formattedDate = `${year}${dateDelimiter}${month}${dateDelimiter}${day}`
                    break
            }
            return formattedDate
        } else {
            // Default YYYY-MM-DD format
            return randomDate.toISOString().split('T')[0]
        }
    }

    // Generate data based on selected options
    const generateData = () => {
        setError('')
        setCopySuccess('')

        if (count <= 0 || count > 10000) {
            setError('Count must be between 1 and 10,000')
            return
        }

        if (
            (dataType === 'integer' || dataType === 'float') &&
            minValue >= maxValue
        ) {
            setError('Min value must be less than max value')
            return
        }

        const newItems = []

        for (let i = 0; i < count; i++) {
            let item

            switch (dataType) {
                case 'string':
                    item = generateRandomString(stringLength)
                    break
                case 'integer':
                    item = generateRandomInt(minValue, maxValue)
                    break
                case 'float':
                    item = generateRandomFloat(
                        minValue,
                        maxValue,
                        decimalPlaces
                    )
                    break
                case 'boolean':
                    item = generateRandomBoolean()
                    break
                case 'date':
                    item = generateRandomDate()
                    break
                default:
                    item = ''
            }

            if (item !== '') {
                newItems.push({
                    value: `${prefix}${item}${suffix}`,
                    type: dataType,
                    raw: item
                })
            }
        }

        // Add to existing items
        const updatedItems = [...generatedItems, ...newItems]
        setGeneratedItems(updatedItems)

        // Update the displayed list
        updateGeneratedList(updatedItems)
    }

    // Update the generated list from items
    const updateGeneratedList = (items = generatedItems) => {
        const list = items.map((item) => item.value)
        setGeneratedList(list)
    }

    // Shuffle the generated items
    const shuffleItems = () => {
        if (generatedItems.length <= 1) {
            setError('Need at least two items to shuffle')
            return
        }

        // Fisher-Yates shuffle algorithm
        const shuffled = [...generatedItems]
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }

        setGeneratedItems(shuffled)
        updateGeneratedList(shuffled)
        setCopySuccess('Items shuffled!')
    }

    // Copy list to clipboard
    const copyToClipboard = () => {
        if (generatedList.length === 0) {
            setError('No data to copy')
            return
        }

        let separatorString
        switch (separator) {
            case 'comma':
                separatorString = ', '
                break
            case 'semicolon':
                separatorString = '; '
                break
            case 'tab':
                separatorString = '\t'
                break
            case 'space':
                separatorString = ' '
                break
            default:
                separatorString = '\n'
        }

        const text = generatedList.join(separatorString)
        navigator.clipboard
            .writeText(text)
            .then(() => {
                setCopySuccess('Copied to clipboard!')
            })
            .catch((err) => {
                setError('Failed to copy: ' + err)
            })
    }

    // Download list as a file
    const downloadList = () => {
        if (generatedList.length === 0) {
            setError('No data to download')
            return
        }

        let separatorString
        switch (separator) {
            case 'comma':
                separatorString = ', '
                break
            case 'semicolon':
                separatorString = '; '
                break
            case 'tab':
                separatorString = '\t'
                break
            case 'space':
                separatorString = ' '
                break
            default:
                separatorString = '\n'
        }

        const text = generatedList.join(separatorString)
        const element = document.createElement('a')
        const file = new Blob([text], { type: 'text/plain' })
        element.href = URL.createObjectURL(file)
        element.download = `data_generator_output.txt`
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
    }

    // Clear the generated list
    const clearList = () => {
        setGeneratedItems([])
        setGeneratedList([])
        setCopySuccess('')
        setError('')
    }

    // Get badge color based on data type
    const getBadgeColor = (type) => {
        switch (type) {
            case 'string':
                return 'primary'
            case 'integer':
                return 'success'
            case 'float':
                return 'info'
            case 'boolean':
                return 'warning'
            case 'date':
                return 'danger'
            default:
                return 'secondary'
        }
    }

    return (
        <Container className="data-generator py-4">
            <h1 className="text-center mb-4">Data Generator</h1>
            <p className="text-center mb-4">
                Generate random data of various types. Mix different data types
                and customize your output.
            </p>

            <Row>
                <Col lg={5} md={12} className="mb-4">
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h2 className="h4 mb-3">Data Options</h2>

                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Data Type</Form.Label>
                                    <Form.Select
                                        value={dataType}
                                        onChange={(e) =>
                                            setDataType(e.target.value)
                                        }
                                    >
                                        <option value="string">Strings</option>
                                        <option value="integer">
                                            Integers
                                        </option>
                                        <option value="float">Floats</option>
                                        <option value="boolean">
                                            Booleans
                                        </option>
                                        <option value="date">Dates</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Number of Items</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={count}
                                        onChange={(e) =>
                                            handleCountChange(e.target.value)
                                        }
                                        min="1"
                                        max="10000"
                                    />
                                    <Form.Text className="text-muted">
                                        Range: 1-10,000 items
                                    </Form.Text>
                                </Form.Group>

                                {(dataType === 'integer' ||
                                    dataType === 'float') && (
                                    <>
                                        <Row>
                                            <Col>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>
                                                        Min Value
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        value={minValue}
                                                        onChange={(e) =>
                                                            handleMinValueChange(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>
                                                        Max Value
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        value={maxValue}
                                                        onChange={(e) =>
                                                            handleMaxValueChange(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        {dataType === 'float' && (
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    Decimal Places
                                                </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    value={decimalPlaces}
                                                    onChange={(e) =>
                                                        setDecimalPlaces(
                                                            Math.min(
                                                                Math.max(
                                                                    0,
                                                                    parseInt(
                                                                        e.target
                                                                            .value
                                                                    ) || 0
                                                                ),
                                                                10
                                                            )
                                                        )
                                                    }
                                                    min="0"
                                                    max="10"
                                                />
                                                <Form.Text className="text-muted">
                                                    Range: 0-10 decimal places
                                                </Form.Text>
                                            </Form.Group>
                                        )}
                                    </>
                                )}

                                {dataType === 'string' && (
                                    <>
                                        <Form.Group className="mb-3">
                                            <Form.Label>
                                                String Generation Type
                                            </Form.Label>
                                            <Form.Select
                                                value={stringGenerationType}
                                                onChange={(e) =>
                                                    setStringGenerationType(
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="random">
                                                    Random Characters
                                                </option>
                                                <option value="english-words">
                                                    English Words
                                                </option>
                                                <option value="custom-words">
                                                    Custom Words
                                                </option>
                                            </Form.Select>
                                        </Form.Group>

                                        {stringGenerationType === 'random' && (
                                            <>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>
                                                        String Length
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        value={stringLength}
                                                        onChange={(e) =>
                                                            setStringLength(
                                                                parseInt(
                                                                    e.target
                                                                        .value
                                                                ) || 1
                                                            )
                                                        }
                                                        min="1"
                                                        max="100"
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Check
                                                        type="checkbox"
                                                        id="useCustomCharset"
                                                        label="Use Custom Character Set"
                                                        checked={
                                                            useCustomCharset
                                                        }
                                                        onChange={(e) =>
                                                            setUseCustomCharset(
                                                                e.target.checked
                                                            )
                                                        }
                                                    />
                                                </Form.Group>

                                                {useCustomCharset ? (
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>
                                                            Custom Character Set
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            value={
                                                                customCharset
                                                            }
                                                            onChange={(e) =>
                                                                setCustomCharset(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="e.g., ABC123!@#"
                                                        />
                                                        <Form.Text className="text-muted">
                                                            Enter all characters
                                                            to use for random
                                                            generation
                                                        </Form.Text>
                                                    </Form.Group>
                                                ) : (
                                                    <>
                                                        <Form.Group className="mb-3">
                                                            <Form.Check
                                                                type="checkbox"
                                                                id="includeUppercase"
                                                                label="Include Uppercase Letters (A-Z)"
                                                                checked={
                                                                    includeUppercase
                                                                }
                                                                onChange={(e) =>
                                                                    setIncludeUppercase(
                                                                        e.target
                                                                            .checked
                                                                    )
                                                                }
                                                            />
                                                        </Form.Group>

                                                        <Form.Group className="mb-3">
                                                            <Form.Check
                                                                type="checkbox"
                                                                id="includeLowercase"
                                                                label="Include Lowercase Letters (a-z)"
                                                                checked={
                                                                    includeLowercase
                                                                }
                                                                onChange={(e) =>
                                                                    setIncludeLowercase(
                                                                        e.target
                                                                            .checked
                                                                    )
                                                                }
                                                            />
                                                        </Form.Group>

                                                        <Form.Group className="mb-3">
                                                            <Form.Check
                                                                type="checkbox"
                                                                id="includeNumbers"
                                                                label="Include Numbers (0-9)"
                                                                checked={
                                                                    includeNumbers
                                                                }
                                                                onChange={(e) =>
                                                                    setIncludeNumbers(
                                                                        e.target
                                                                            .checked
                                                                    )
                                                                }
                                                            />
                                                        </Form.Group>

                                                        <Form.Group className="mb-3">
                                                            <Form.Check
                                                                type="checkbox"
                                                                id="includeSpecial"
                                                                label="Include Special Characters (!@#$%^&*...)"
                                                                checked={
                                                                    includeSpecial
                                                                }
                                                                onChange={(e) =>
                                                                    setIncludeSpecial(
                                                                        e.target
                                                                            .checked
                                                                    )
                                                                }
                                                            />
                                                        </Form.Group>
                                                    </>
                                                )}
                                            </>
                                        )}

                                        {stringGenerationType ===
                                            'custom-words' && (
                                            <>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>
                                                        Custom Words
                                                    </Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={5}
                                                        placeholder="Enter your custom words"
                                                        value={customWords}
                                                        onChange={(e) =>
                                                            setCustomWords(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Label>
                                                        Word Separator
                                                    </Form.Label>
                                                    <Form.Select
                                                        value={
                                                            customWordsSeparator
                                                        }
                                                        onChange={(e) =>
                                                            setCustomWordsSeparator(
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option value="comma">
                                                            Comma (,)
                                                        </option>
                                                        <option value="newline">
                                                            New Line
                                                        </option>
                                                        <option value="space">
                                                            Space
                                                        </option>
                                                        <option value="tab">
                                                            Tab
                                                        </option>
                                                    </Form.Select>
                                                    <Form.Text className="text-muted">
                                                        Choose how your words
                                                        are separated in the
                                                        text above
                                                    </Form.Text>
                                                </Form.Group>
                                            </>
                                        )}
                                    </>
                                )}

                                {dataType === 'boolean' && (
                                    <Form.Group className="mb-3">
                                        <Form.Label>Boolean Type</Form.Label>
                                        <Form.Select
                                            value={booleanType}
                                            onChange={(e) =>
                                                setBooleanType(e.target.value)
                                            }
                                        >
                                            <option value="random">
                                                Random (True/False)
                                            </option>
                                            <option value="all-true">
                                                All True
                                            </option>
                                            <option value="all-false">
                                                All False
                                            </option>
                                        </Form.Select>
                                    </Form.Group>
                                )}

                                {dataType === 'date' && (
                                    <Form.Group className="mb-3">
                                        <Form.Label>Date Format</Form.Label>
                                        <Form.Select
                                            value={dateFormat}
                                            onChange={(e) =>
                                                setDateFormat(e.target.value)
                                            }
                                        >
                                            <option value="YYYY-MM-DD">
                                                YYYY-MM-DD
                                            </option>
                                            <option value="custom">
                                                Custom Format
                                            </option>
                                            <option value="MMMM D, YYYY">
                                                Month Day, Year
                                            </option>
                                            <option value="ISO">
                                                ISO Format
                                            </option>
                                        </Form.Select>

                                        {dateFormat === 'custom' && (
                                            <>
                                                <Form.Group className="mt-3">
                                                    <Form.Label>
                                                        Date Order
                                                    </Form.Label>
                                                    <Form.Select
                                                        value={dateOrder}
                                                        onChange={(e) =>
                                                            setDateOrder(
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option value="YMD">
                                                            Year-Month-Day
                                                        </option>
                                                        <option value="MDY">
                                                            Month-Day-Year
                                                        </option>
                                                        <option value="DMY">
                                                            Day-Month-Year
                                                        </option>
                                                    </Form.Select>
                                                </Form.Group>

                                                <Form.Group className="mt-3">
                                                    <Form.Label>
                                                        Date Delimiter
                                                    </Form.Label>
                                                    <Form.Select
                                                        value={dateDelimiter}
                                                        onChange={(e) =>
                                                            setDateDelimiter(
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option value="-">
                                                            Dash (-)
                                                        </option>
                                                        <option value="/">
                                                            Slash (/)
                                                        </option>
                                                        <option value=".">
                                                            Dot (.)
                                                        </option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </>
                                        )}
                                    </Form.Group>
                                )}

                                <Form.Group className="mb-3">
                                    <Form.Label>Separator</Form.Label>
                                    <Form.Select
                                        value={separator}
                                        onChange={(e) =>
                                            setSeparator(e.target.value)
                                        }
                                    >
                                        <option value="newline">
                                            New Line
                                        </option>
                                        <option value="comma">Comma</option>
                                        <option value="semicolon">
                                            Semicolon
                                        </option>
                                        <option value="tab">Tab</option>
                                        <option value="space">Space</option>
                                    </Form.Select>
                                </Form.Group>

                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Prefix</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={prefix}
                                                onChange={(e) =>
                                                    setPrefix(e.target.value)
                                                }
                                                placeholder="e.g., Item_"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Suffix</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={suffix}
                                                onChange={(e) =>
                                                    setSuffix(e.target.value)
                                                }
                                                placeholder="e.g., _end"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <div className="d-grid gap-2 mt-4">
                                    <Button
                                        variant="primary"
                                        onClick={generateData}
                                        className="d-flex align-items-center justify-content-center"
                                    >
                                        <FaPlus className="me-2" /> Add {count}{' '}
                                        {dataType}(s)
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={7} md={12}>
                    <Card className="shadow-sm h-100">
                        <Card.Body className="d-flex flex-column">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h2 className="h4 mb-0">Generated Data</h2>
                                <div>
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={shuffleItems}
                                        className="me-2"
                                        disabled={generatedItems.length <= 1}
                                    >
                                        <FaShuffle className="me-1" /> Shuffle
                                    </Button>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={copyToClipboard}
                                        className="me-2"
                                        disabled={generatedList.length === 0}
                                    >
                                        <FaCopy className="me-1" /> Copy
                                    </Button>
                                    <Button
                                        variant="outline-success"
                                        size="sm"
                                        onClick={downloadList}
                                        className="me-2"
                                        disabled={generatedList.length === 0}
                                    >
                                        <FaDownload className="me-1" /> Download
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={clearList}
                                        disabled={generatedList.length === 0}
                                    >
                                        <FaTrash className="me-1" /> Clear
                                    </Button>
                                </div>
                            </div>

                            {copySuccess && (
                                <Alert
                                    variant="success"
                                    className="py-2 px-3 mb-3"
                                >
                                    {copySuccess}
                                </Alert>
                            )}

                            {error && (
                                <Alert
                                    variant="danger"
                                    className="py-2 px-3 mb-3"
                                >
                                    {error}
                                </Alert>
                            )}

                            <div className="data-summary mb-2">
                                {generatedItems.length > 0 && (
                                    <div className="d-flex flex-wrap gap-2">
                                        <Badge bg="secondary">
                                            Total: {generatedItems.length}
                                        </Badge>
                                        {[
                                            'string',
                                            'integer',
                                            'float',
                                            'boolean',
                                            'date'
                                        ].map((type) => {
                                            const count = generatedItems.filter(
                                                (item) => item.type === type
                                            ).length
                                            if (count > 0) {
                                                return (
                                                    <Badge
                                                        key={type}
                                                        bg={getBadgeColor(type)}
                                                    >
                                                        {type}s: {count}
                                                    </Badge>
                                                )
                                            }
                                            return null
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className="list-output flex-grow-1">
                                {generatedList.length > 0 ? (
                                    <pre className="mb-0">
                                        {generatedItems.map((item, index) => (
                                            <div
                                                key={index}
                                                className={`list-item list-item-${item.type}`}
                                            >
                                                <span className="item-value">
                                                    {item.value}
                                                </span>
                                                <Badge
                                                    bg={getBadgeColor(
                                                        item.type
                                                    )}
                                                    className="item-type-badge"
                                                >
                                                    {item.type}
                                                </Badge>
                                            </div>
                                        ))}
                                    </pre>
                                ) : (
                                    <div className="text-center text-muted h-100 d-flex align-items-center justify-content-center">
                                        <div>
                                            <FaShuffle
                                                size={40}
                                                className="mb-3 opacity-50"
                                            />
                                            <p>
                                                Configure your options and click
                                                "Add" to create random data
                                            </p>
                                            <p className="small">
                                                You can mix different data types
                                                by changing the type and adding
                                                more data
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default DataGenerator
