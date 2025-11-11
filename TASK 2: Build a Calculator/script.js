class Calculator {
            constructor() {
                this.previousOperandElement = document.querySelector('.previous-operand');
                this.currentOperandElement = document.querySelector('.current-operand');
                this.clear();
                this.setupEventListeners();
            }

            clear() {
                this.currentOperand = '0';
                this.previousOperand = '';
                this.operation = undefined;
                this.shouldResetScreen = false;
            }

            delete() {
                if (this.currentOperand.length === 1) {
                    this.currentOperand = '0';
                } else {
                    this.currentOperand = this.currentOperand.slice(0, -1);
                }
            }

            appendNumber(number) {
                if (this.shouldResetScreen) {
                    this.currentOperand = '';
                    this.shouldResetScreen = false;
                }
                
                if (number === '.' && this.currentOperand.includes('.')) return;
                
                if (this.currentOperand === '0' && number !== '.') {
                    this.currentOperand = number;
                } else {
                    this.currentOperand += number;
                }
            }

            chooseOperation(operation) {
                if (this.currentOperand === '') return;
                
                if (this.previousOperand !== '') {
                    this.calculate();
                }
                
                this.operation = operation;
                this.previousOperand = this.currentOperand;
                this.shouldResetScreen = true;
            }

            calculate() {
                let computation;
                const prev = parseFloat(this.previousOperand);
                const current = parseFloat(this.currentOperand);
                
                if (isNaN(prev) || isNaN(current)) return;
                
                switch (this.operation) {
                    case '+':
                        computation = prev + current;
                        break;
                    case '-':
                        computation = prev - current;
                        break;
                    case '*':
                        computation = prev * current;
                        break;
                    case '÷':
                        if (current === 0) {
                            alert("Cannot divide by zero!");
                            return;
                        }
                        computation = prev / current;
                        break;
                    default:
                        return;
                }
                
                this.currentOperand = this.roundResult(computation).toString();
                this.operation = undefined;
                this.previousOperand = '';
                this.shouldResetScreen = true;
            }

            roundResult(number) {
                return Math.round(number * 100000000) / 100000000;
            }

            getDisplayNumber(number) {
                const stringNumber = number.toString();
                const integerDigits = parseFloat(stringNumber.split('.')[0]);
                const decimalDigits = stringNumber.split('.')[1];
                
                let integerDisplay;
                
                if (isNaN(integerDigits)) {
                    integerDisplay = '';
                } else {
                    integerDisplay = integerDigits.toLocaleString('en', {
                        maximumFractionDigits: 0
                    });
                }
                
                if (decimalDigits != null) {
                    return `${integerDisplay}.${decimalDigits}`;
                } else {
                    return integerDisplay;
                }
            }

            updateDisplay() {
                this.currentOperandElement.textContent = this.getDisplayNumber(this.currentOperand);
                
                if (this.operation != null) {
                    this.previousOperandElement.textContent = 
                        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
                } else {
                    this.previousOperandElement.textContent = '';
                }
            }

            handleKeyboardInput(event) {
                if (event.key >= '0' && event.key <= '9') {
                    this.appendNumber(event.key);
                } else if (event.key === '.') {
                    this.appendNumber('.');
                } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
                    let operation;
                    if (event.key === '/') operation = '÷';
                    else operation = event.key;
                    this.chooseOperation(operation);
                } else if (event.key === 'Enter' || event.key === '=') {
                    event.preventDefault();
                    this.calculate();
                } else if (event.key === 'Escape' || event.key === 'Delete') {
                    this.clear();
                } else if (event.key === 'Backspace') {
                    this.delete();
                }
                
                this.updateDisplay();
                this.highlightOperatorButton();
            }

            highlightOperatorButton() {
                // Remove highlight from all operator buttons
                document.querySelectorAll('.operator').forEach(button => {
                    button.classList.remove('active-operator');
                });
                
                // Highlight the active operator if there is one
                if (this.operation) {
                    const operatorButton = document.querySelector(`.operator[data-operation="${this.operation}"]`);
                    if (operatorButton) {
                        operatorButton.classList.add('active-operator');
                    }
                }
            }

            setupEventListeners() {
                // Number buttons
                document.querySelectorAll('[data-number]').forEach(button => {
                    button.addEventListener('click', () => {
                        this.appendNumber(button.getAttribute('data-number'));
                        this.updateDisplay();
                    });
                });

                // Operation buttons
                document.querySelectorAll('[data-operation]').forEach(button => {
                    button.addEventListener('click', () => {
                        this.chooseOperation(button.getAttribute('data-operation'));
                        this.updateDisplay();
                        this.highlightOperatorButton();
                    });
                });

                // Action buttons
                document.querySelector('[data-action="calculate"]').addEventListener('click', () => {
                    this.calculate();
                    this.updateDisplay();
                    this.highlightOperatorButton();
                });

                document.querySelector('[data-action="clear"]').addEventListener('click', () => {
                    this.clear();
                    this.updateDisplay();
                    this.highlightOperatorButton();
                });

                document.querySelector('[data-action="delete"]').addEventListener('click', () => {
                    this.delete();
                    this.updateDisplay();
                });

                // Keyboard support
                document.addEventListener('keydown', (event) => {
                    this.handleKeyboardInput(event);
                });
            }
        }

        // Initialize the calculator
        const calculator = new Calculator();
        calculator.updateDisplay();