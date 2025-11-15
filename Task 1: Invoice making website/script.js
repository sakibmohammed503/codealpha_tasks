// Invoice Maker Application
class InvoiceMaker {
    constructor() {
        this.init();
        this.setDefaultDates();
        this.attachEventListeners();
        this.updatePreview();
    }

    init() {
        this.elements = {
            invoiceNumber: document.getElementById('invoice-number'),
            invoiceDate: document.getElementById('invoice-date'),
            dueDate: document.getElementById('due-date'),
            yourName: document.getElementById('your-name'),
            yourAddress: document.getElementById('your-address'),
            yourEmail: document.getElementById('your-email'),
            yourPhone: document.getElementById('your-phone'),
            clientName: document.getElementById('client-name'),
            clientAddress: document.getElementById('client-address'),
            clientEmail: document.getElementById('client-email'),
            taxRate: document.getElementById('tax-rate'),
            notes: document.getElementById('notes'),
            itemsContainer: document.getElementById('items-container'),
            addItemBtn: document.getElementById('add-item'),
            generatePdfBtn: document.getElementById('generate-pdf'),
            printInvoiceBtn: document.getElementById('print-invoice'),
            clearFormBtn: document.getElementById('clear-form'),
            invoicePreview: document.getElementById('invoice-preview')
        };
    }

    setDefaultDates() {
        const today = new Date().toISOString().split('T')[0];
        this.elements.invoiceDate.value = today;
        
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);
        this.elements.dueDate.value = dueDate.toISOString().split('T')[0];
    }

    attachEventListeners() {
        // Add item button
        this.elements.addItemBtn.addEventListener('click', () => this.addItem());

        // Remove item event delegation
        this.elements.itemsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-item')) {
                this.removeItem(e.target);
            }
        });

        // Input changes for real-time preview
        const formInputs = document.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', () => this.updatePreview());
        });

        // Item input changes
        this.elements.itemsContainer.addEventListener('input', (e) => {
            if (e.target.classList.contains('item-qty') || 
                e.target.classList.contains('item-price') ||
                e.target.classList.contains('item-desc')) {
                this.updateItemTotal(e.target);
                this.updatePreview();
            }
        });

        // Action buttons
        this.elements.printInvoiceBtn.addEventListener('click', () => this.printInvoice());
        this.elements.clearFormBtn.addEventListener('click', () => this.clearForm());
        this.elements.generatePdfBtn.addEventListener('click', () => this.generatePDF());
    }

    addItem() {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><input type="text" class="item-desc" placeholder="Item description"></td>
            <td><input type="number" class="item-qty" value="1" min="1"></td>
            <td><input type="number" class="item-price" value="0.00" step="0.01" min="0"></td>
            <td class="item-total">0.00</td>
            <td><button class="btn btn-danger remove-item">×</button></td>
        `;
        this.elements.itemsContainer.appendChild(newRow);
        this.updatePreview();
    }

    removeItem(button) {
        const rows = this.elements.itemsContainer.querySelectorAll('tr');
        if (rows.length > 1) {
            button.closest('tr').remove();
            this.updatePreview();
        } else {
            alert('You need at least one item in your invoice.');
        }
    }

    updateItemTotal(input) {
        const row = input.closest('tr');
        const qtyInput = row.querySelector('.item-qty');
        const priceInput = row.querySelector('.item-price');
        const totalCell = row.querySelector('.item-total');
        
        const qty = parseFloat(qtyInput.value) || 0;
        const price = parseFloat(priceInput.value) || 0;
        const total = qty * price;
        
        totalCell.textContent = total.toFixed(2);
    }

    getInvoiceData() {
        const items = [];
        let subtotal = 0;

        this.elements.itemsContainer.querySelectorAll('tr').forEach(row => {
            const desc = row.querySelector('.item-desc').value;
            const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
            const price = parseFloat(row.querySelector('.item-price').value) || 0;
            const total = qty * price;

            if (desc.trim()) {
                items.push({ desc, qty, price, total });
                subtotal += total;
            }
        });

        const taxRate = parseFloat(this.elements.taxRate.value) || 0;
        const tax = subtotal * (taxRate / 100);
        const total = subtotal + tax;

        return {
            invoiceNumber: this.elements.invoiceNumber.value || 'INV-001',
            invoiceDate: this.elements.invoiceDate.value,
            dueDate: this.elements.dueDate.value,
            yourName: this.elements.yourName.value || 'Your Company Name',
            yourAddress: this.elements.yourAddress.value || 'Your Address',
            yourEmail: this.elements.yourEmail.value || 'your.email@example.com',
            yourPhone: this.elements.yourPhone.value || '',
            clientName: this.elements.clientName.value || 'Client Company Name',
            clientAddress: this.elements.clientAddress.value || 'Client Address',
            clientEmail: this.elements.clientEmail.value || '',
            taxRate,
            notes: this.elements.notes.value,
            items,
            subtotal,
            tax,
            total
        };
    }

    updatePreview() {
        const data = this.getInvoiceData();
        
        if (!data.items.length && !data.yourName && !data.clientName) {
            this.showEmptyState();
            return;
        }

        this.elements.invoicePreview.innerHTML = this.generateInvoiceHTML(data);
    }

    showEmptyState() {
        this.elements.invoicePreview.innerHTML = `
            <div class="empty-state">
                <h3>Your invoice will appear here</h3>
                <p>Fill in the form to see a preview of your invoice</p>
            </div>
        `;
    }

    generateInvoiceHTML(data) {
        const formatDate = (dateString) => {
            if (!dateString) return '';
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        };

        const formatCurrency = (amount) => {
            return `$${amount.toFixed(2)}`;
        };

        let itemsHTML = '';
        if (data.items.length > 0) {
            itemsHTML = `
                <table class="invoice-items">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.items.map(item => `
                            <tr>
                                <td>${item.desc}</td>
                                <td>${item.qty}</td>
                                <td>${formatCurrency(item.price)}</td>
                                <td>${formatCurrency(item.total)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }

        return `
            <div class="invoice-header">
                <div class="invoice-title">INVOICE</div>
                <div class="invoice-details">
                    <div><strong>Invoice #:</strong> ${data.invoiceNumber}</div>
                    <div><strong>Date:</strong> ${formatDate(data.invoiceDate)}</div>
                    <div><strong>Due Date:</strong> ${formatDate(data.dueDate)}</div>
                </div>
            </div>
            
            <div class="invoice-addresses">
                <div class="invoice-address">
                    <strong>From:</strong><br>
                    ${data.yourName}<br>
                    ${data.yourAddress.replace(/\n/g, '<br>')}<br>
                    ${data.yourEmail}<br>
                    ${data.yourPhone}
                </div>
                <div class="invoice-address">
                    <strong>To:</strong><br>
                    ${data.clientName}<br>
                    ${data.clientAddress.replace(/\n/g, '<br>')}<br>
                    ${data.clientEmail}
                </div>
            </div>
            
            ${itemsHTML}
            
            <table class="invoice-totals">
                <tr>
                    <td>Subtotal:</td>
                    <td>${formatCurrency(data.subtotal)}</td>
                </tr>
                <tr>
                    <td>Tax (${data.taxRate}%):</td>
                    <td>${formatCurrency(data.tax)}</td>
                </tr>
                <tr>
                    <td>Total:</td>
                    <td>${formatCurrency(data.total)}</td>
                </tr>
            </table>
            
            ${data.notes ? `
                <div class="invoice-notes">
                    <strong>Notes:</strong><br>
                    ${data.notes.replace(/\n/g, '<br>')}
                </div>
            ` : ''}
        `;
    }

    printInvoice() {
        window.print();
    }

    clearForm() {
        if (confirm('Are you sure you want to clear the form? All data will be lost.')) {
            // Clear all inputs
            const inputs = document.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                if (input.id !== 'invoice-date' && input.id !== 'due-date') {
                    input.value = '';
                }
            });

            // Reset tax rate
            this.elements.taxRate.value = '10';

            // Reset items to one empty row
            this.elements.itemsContainer.innerHTML = `
                <tr>
                    <td><input type="text" class="item-desc" placeholder="Item description"></td>
                    <td><input type="number" class="item-qty" value="1" min="1"></td>
                    <td><input type="number" class="item-price" value="0.00" step="0.01" min="0"></td>
                    <td class="item-total">0.00</td>
                    <td><button class="btn btn-danger remove-item">×</button></td>
                </tr>
            `;

            this.updatePreview();
        }
    }

    generatePDF() {
        // This is a placeholder for PDF generation functionality
        // In a real implementation, you would use a library like jsPDF
        alert('PDF generation would be implemented with a library like jsPDF. For now, you can use the Print function to save as PDF.');
        
        // Example of how jsPDF could be integrated:
        /*
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add content to PDF
        doc.text('Invoice', 20, 20);
        // ... more PDF content
        
        doc.save('invoice.pdf');
        */
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InvoiceMaker();
});