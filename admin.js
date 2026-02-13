// Initialize data
        let salesData = JSON.parse(localStorage.getItem('farmSales') || '[]');
        let ordersData = JSON.parse(localStorage.getItem('farmOrders') || '[]');
        let medicalData = JSON.parse(localStorage.getItem('farmMedical') || '[]');
        let inventoryData = JSON.parse(localStorage.getItem('farmInventory') || '[]');
        let customersData = JSON.parse(localStorage.getItem('farmCustomers') || '[]');
        let selectedCustomerIds = [];

        // Menu navigation
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', function() {
                const section = this.dataset.section;
                
                document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                
                document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
                document.getElementById(section).classList.add('active');
                
                const titles = {
                    'dashboard': 'Dashboard Overview',
                    'customers': 'Registered Customers',
                    'alerts': 'Send Customer Alerts',
                    'sales': 'Sales Records',
                    'orders': 'Customer Orders',
                    'medical': 'Medical Records',
                    'inventory': 'Inventory Management',
                    'media': 'Media Library',
                    'content': 'Edit Website Content',
                    'settings': 'Settings'
                };
                document.getElementById('pageTitle').textContent = titles[section];
                
                if (section === 'customers') loadCustomers();
                if (section === 'sales') loadSales();
                if (section === 'orders') loadOrders();
                if (section === 'medical') loadMedical();
                if (section === 'inventory') loadInventory();
                if (section === 'media') loadAllMedia();
            });
        });

        // Modal functions
        function openModal(modalId) {
            document.getElementById(modalId).classList.add('active');
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('active');
        }

        // Customers management
        function loadCustomers() {
            const tbody = document.getElementById('customersTable');
            tbody.innerHTML = '';
            
            customersData.forEach((customer, index) => {
                const row = `
                    <tr>
                        <td>${customer.name}</td>
                        <td>${customer.email}</td>
                        <td>${customer.phone}</td>
                        <td>${customer.location}</td>
                        <td>${customer.farmType}</td>
                        <td>${new Date(customer.registeredAt).toLocaleDateString()}</td>
                        <td>
                            <button class="btn btn-danger btn-small" onclick="deleteCustomer(${index})">Delete</button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
            
            updateStats();
        }

        function deleteCustomer(index) {
            if (confirm('Are you sure you want to delete this customer?')) {
                customersData.splice(index, 1);
                localStorage.setItem('farmCustomers', JSON.stringify(customersData));
                loadCustomers();
            }
        }

        function exportCustomersPDF() {
            if (customersData.length === 0) {
                alert('No customers to export');
                return;
            }
            
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            doc.setFontSize(18);
            doc.text('Country Farm Matugga - Customer Database', 14, 20);
            
            const tableData = customersData.map(c => [
                c.name,
                c.email,
                c.phone,
                c.location,
                c.farmType,
                new Date(c.registeredAt).toLocaleDateString()
            ]);
            
            doc.autoTable({
                head: [['Name', 'Email', 'Phone', 'Location', 'Farm Type', 'Registered']],
                body: tableData,
                startY: 30,
                styles: { fontSize: 9 },
                headStyles: { fillColor: [45, 80, 22] }
            });
            
            doc.save(`customers-${Date.now()}.pdf`);
        }

        // Alert system
        function updateRecipients() {
            const type = document.getElementById('recipientType').value;
            const selector = document.getElementById('customerSelector');
            const checkboxesDiv = document.getElementById('customerCheckboxes');
            
            if (type === 'custom') {
                selector.style.display = 'block';
                checkboxesDiv.innerHTML = '';
                customersData.forEach((customer, index) => {
                    const div = document.createElement('div');
                    div.style.padding = '0.5rem';
                    div.innerHTML = `
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="checkbox" value="${index}" onchange="toggleCustomer(${index})">
                            <span>${customer.name} (${customer.email})</span>
                        </label>
                    `;
                    checkboxesDiv.appendChild(div);
                });
            } else {
                selector.style.display = 'none';
                selectedCustomerIds = [];
                updateSelectedCustomersDisplay();
            }
            
            updateAlertPreview();
        }

        function toggleCustomer(index) {
            const idx = selectedCustomerIds.indexOf(index);
            if (idx > -1) {
                selectedCustomerIds.splice(idx, 1);
            } else {
                selectedCustomerIds.push(index);
            }
            updateSelectedCustomersDisplay();
            updateAlertPreview();
        }

        function updateSelectedCustomersDisplay() {
            const container = document.getElementById('selectedCustomers');
            container.innerHTML = '';
            selectedCustomerIds.forEach(id => {
                const customer = customersData[id];
                const chip = document.createElement('div');
                chip.className = 'customer-chip';
                chip.innerHTML = `
                    ${customer.name}
                    <button onclick="toggleCustomer(${id})">×</button>
                `;
                container.appendChild(chip);
            });
        }

        function updateAlertPreview() {
            const type = document.getElementById('recipientType').value;
            let recipientText = 'All customers';
            
            if (type === 'commercial') recipientText = 'All commercial farms';
            else if (type === 'smallscale') recipientText = 'All small-scale farms';
            else if (type === 'backyard') recipientText = 'All backyard farms';
            else if (type === 'custom') recipientText = `${selectedCustomerIds.length} selected customers`;
            
            document.getElementById('previewRecipients').textContent = recipientText;
            document.getElementById('previewSubject').textContent = document.getElementById('alertSubject').value || '-';
            document.getElementById('previewMessage').textContent = document.getElementById('alertMessage').value || '-';
        }

        document.getElementById('alertSubject').addEventListener('input', updateAlertPreview);
        document.getElementById('alertMessage').addEventListener('input', updateAlertPreview);

        function sendAlert() {
            const subject = document.getElementById('alertSubject').value;
            const message = document.getElementById('alertMessage').value;
            const type = document.getElementById('recipientType').value;
            
            if (!subject || !message) {
                alert('Please fill in both subject and message');
                return;
            }
            
            let recipients = [];
            
            if (type === 'all') {
                recipients = customersData;
            } else if (type === 'commercial') {
                recipients = customersData.filter(c => c.farmType === 'Commercial');
            } else if (type === 'smallscale') {
                recipients = customersData.filter(c => c.farmType === 'Small-scale');
            } else if (type === 'backyard') {
                recipients = customersData.filter(c => c.farmType === 'Backyard');
            } else if (type === 'custom') {
                recipients = selectedCustomerIds.map(id => customersData[id]);
            }
            
            if (recipients.length === 0) {
                alert('No recipients selected');
                return;
            }
            
            // Store alert in history
            const alert = {
                subject,
                message,
                recipients: recipients.length,
                sentAt: new Date().toISOString()
            };
            
            const alertHistory = JSON.parse(localStorage.getItem('alertHistory') || '[]');
            alertHistory.push(alert);
            localStorage.setItem('alertHistory', JSON.stringify(alertHistory));
            
            alert(`Alert sent to ${recipients.length} customers!\n\nIn a production environment, this would send emails to:\n${recipients.map(r => r.email).join('\n')}`);
            
            // Reset form
            document.getElementById('alertSubject').value = '';
            document.getElementById('alertMessage').value = '';
            document.getElementById('recipientType').value = 'all';
            updateRecipients();
        }

        // Sales functions
        function addSale(event) {
            event.preventDefault();
            
            const sale = {
                id: Date.now(),
                date: document.getElementById('saleDate').value,
                product: document.getElementById('saleProduct').value,
                quantity: parseInt(document.getElementById('saleQuantity').value),
                unitPrice: parseInt(document.getElementById('saleUnitPrice').value),
                customer: document.getElementById('saleCustomer').value,
                phone: document.getElementById('salePhone').value
            };
            
            sale.total = sale.quantity * sale.unitPrice;
            
            salesData.push(sale);
            localStorage.setItem('farmSales', JSON.stringify(salesData));
            
            closeModal('addSaleModal');
            document.getElementById('addSaleForm').reset();
            loadSales();
            
            alert('Sale added successfully!');
        }

        function loadSales() {
            const tbody = document.getElementById('salesTable');
            tbody.innerHTML = '';
            
            salesData.forEach(sale => {
                const row = `
                    <tr>
                        <td>${sale.date}</td>
                        <td>${sale.product}</td>
                        <td>${sale.quantity}</td>
                        <td>UGX ${sale.unitPrice.toLocaleString()}</td>
                        <td>UGX ${sale.total.toLocaleString()}</td>
                        <td>${sale.customer}</td>
                        <td>
                            <button class="btn btn-danger btn-small" onclick="deleteSale(${sale.id})">Delete</button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        }

        function deleteSale(id) {
            if (confirm('Are you sure?')) {
                salesData = salesData.filter(s => s.id !== id);
                localStorage.setItem('farmSales', JSON.stringify(salesData));
                loadSales();
            }
        }

        function filterSales() {
            const fromDate = document.getElementById('salesFromDate').value;
            const toDate = document.getElementById('salesToDate').value;
            
            if (!fromDate || !toDate) {
                alert('Please select both dates');
                return;
            }
            
            const filtered = salesData.filter(sale => sale.date >= fromDate && sale.date <= toDate);
            
            const tbody = document.getElementById('salesTable');
            tbody.innerHTML = '';
            
            filtered.forEach(sale => {
                const row = `
                    <tr>
                        <td>${sale.date}</td>
                        <td>${sale.product}</td>
                        <td>${sale.quantity}</td>
                        <td>UGX ${sale.unitPrice.toLocaleString()}</td>
                        <td>UGX ${sale.total.toLocaleString()}</td>
                        <td>${sale.customer}</td>
                        <td>
                            <button class="btn btn-danger btn-small" onclick="deleteSale(${sale.id})">Delete</button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        }

        function generateSalesPDF() {
            const fromDate = document.getElementById('salesFromDate').value;
            const toDate = document.getElementById('salesToDate').value;
            
            const dataToExport = (fromDate && toDate) ? 
                salesData.filter(sale => sale.date >= fromDate && sale.date <= toDate) : 
                salesData;
            
            if (dataToExport.length === 0) {
                alert('No sales records to export');
                return;
            }
            
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            doc.setFontSize(18);
            doc.text('Country Farm Matugga - Sales Report', 14, 20);
            
            if (fromDate && toDate) {
                doc.setFontSize(11);
                doc.text(`Period: ${fromDate} to ${toDate}`, 14, 28);
            }
            
            const tableData = dataToExport.map(sale => [
                sale.date,
                sale.product,
                sale.quantity,
                `UGX ${sale.unitPrice.toLocaleString()}`,
                `UGX ${sale.total.toLocaleString()}`,
                sale.customer
            ]);
            
            doc.autoTable({
                head: [['Date', 'Product', 'Quantity', 'Unit Price', 'Total', 'Customer']],
                body: tableData,
                startY: fromDate ? 35 : 30,
                styles: { fontSize: 9 },
                headStyles: { fillColor: [45, 80, 22] }
            });
            
            const totalAmount = dataToExport.reduce((sum, sale) => sum + sale.total, 0);
            doc.text(`Total Sales: UGX ${totalAmount.toLocaleString()}`, 14, doc.lastAutoTable.finalY + 10);
            
            doc.save(`sales-report-${Date.now()}.pdf`);
        }

        // Orders functions
        function loadOrders() {
            const tbody = document.getElementById('ordersTable');
            tbody.innerHTML = '';
            
            ordersData.forEach((order, index) => {
                const row = `
                    <tr>
                        <td>#${String(index + 1).padStart(4, '0')}</td>
                        <td>${new Date(order.timestamp).toLocaleDateString()}</td>
                        <td>${order.name}<br><small>${order.phone}</small></td>
                        <td>${order.product}</td>
                        <td>${order.quantity}</td>
                        <td>${order.total}</td>
                        <td><span class="status-badge status-pending">Pending</span></td>
                        <td>
                            <button class="btn btn-primary btn-small" onclick="viewOrder(${index})">View</button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
            
            updateStats();
        }

        function viewOrder(index) {
            const order = ordersData[index];
            alert(`Order Details:\n\nCustomer: ${order.name}\nPhone: ${order.phone}\nEmail: ${order.email}\nProduct: ${order.product}\nQuantity: ${order.quantity}\nTotal: ${order.total}\nAddress: ${order.address}`);
        }

        function generateOrdersPDF() {
            if (ordersData.length === 0) {
                alert('No orders to export');
                return;
            }
            
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            doc.setFontSize(18);
            doc.text('Country Farm Matugga - Orders Report', 14, 20);
            
            const tableData = ordersData.map((order, index) => [
                `#${String(index + 1).padStart(4, '0')}`,
                new Date(order.timestamp).toLocaleDateString(),
                order.name,
                order.product,
                order.quantity,
                order.total
            ]);
            
            doc.autoTable({
                head: [['Order ID', 'Date', 'Customer', 'Product', 'Quantity', 'Total']],
                body: tableData,
                startY: 30,
                styles: { fontSize: 9 },
                headStyles: { fillColor: [45, 80, 22] }
            });
            
            doc.save(`orders-report-${Date.now()}.pdf`);
        }

        // Medical records functions
        function addMedicalRecord(event) {
            event.preventDefault();
            
            const record = {
                id: Date.now(),
                date: document.getElementById('medicalDate').value,
                batch: document.getElementById('medicalBatch').value,
                type: document.getElementById('medicalType').value,
                medication: document.getElementById('medicalMedication').value,
                dosage: document.getElementById('medicalDosage').value,
                birds: parseInt(document.getElementById('medicalBirds').value),
                notes: document.getElementById('medicalNotes').value
            };
            
            medicalData.push(record);
            localStorage.setItem('farmMedical', JSON.stringify(medicalData));
            
            closeModal('addMedicalModal');
            document.getElementById('addMedicalForm').reset();
            loadMedical();
            
            alert('Medical record added successfully!');
        }

        function loadMedical() {
            const tbody = document.getElementById('medicalTable');
            tbody.innerHTML = '';
            
            medicalData.forEach(record => {
                const row = `
                    <tr>
                        <td>${record.date}</td>
                        <td>${record.batch}</td>
                        <td>${record.type}</td>
                        <td>${record.medication}</td>
                        <td>${record.dosage}</td>
                        <td>${record.birds}</td>
                        <td>${record.notes || '-'}</td>
                        <td>
                            <button class="btn btn-danger btn-small" onclick="deleteMedical(${record.id})">Delete</button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        }

        function deleteMedical(id) {
            if (confirm('Are you sure?')) {
                medicalData = medicalData.filter(r => r.id !== id);
                localStorage.setItem('farmMedical', JSON.stringify(medicalData));
                loadMedical();
            }
        }

        function filterMedical() {
            const fromDate = document.getElementById('medicalFromDate').value;
            const toDate = document.getElementById('medicalToDate').value;
            
            if (!fromDate || !toDate) {
                alert('Please select both dates');
                return;
            }
            
            const filtered = medicalData.filter(record => record.date >= fromDate && record.date <= toDate);
            
            const tbody = document.getElementById('medicalTable');
            tbody.innerHTML = '';
            
            filtered.forEach(record => {
                const row = `
                    <tr>
                        <td>${record.date}</td>
                        <td>${record.batch}</td>
                        <td>${record.type}</td>
                        <td>${record.medication}</td>
                        <td>${record.dosage}</td>
                        <td>${record.birds}</td>
                        <td>${record.notes || '-'}</td>
                        <td>
                            <button class="btn btn-danger btn-small" onclick="deleteMedical(${record.id})">Delete</button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        }

        function generateMedicalPDF() {
            const fromDate = document.getElementById('medicalFromDate').value;
            const toDate = document.getElementById('medicalToDate').value;
            
            const dataToExport = (fromDate && toDate) ? 
                medicalData.filter(record => record.date >= fromDate && record.date <= toDate) : 
                medicalData;
            
            if (dataToExport.length === 0) {
                alert('No medical records to export');
                return;
            }
            
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            doc.setFontSize(18);
            doc.text('Country Farm Matugga - Medical Records', 14, 20);
            
            if (fromDate && toDate) {
                doc.setFontSize(11);
                doc.text(`Period: ${fromDate} to ${toDate}`, 14, 28);
            }
            
            const tableData = dataToExport.map(record => [
                record.date,
                record.batch,
                record.type,
                record.medication,
                record.dosage,
                record.birds
            ]);
            
            doc.autoTable({
                head: [['Date', 'Batch ID', 'Type', 'Medication', 'Dosage', 'Birds']],
                body: tableData,
                startY: fromDate ? 35 : 30,
                styles: { fontSize: 9 },
                headStyles: { fillColor: [45, 80, 22] }
            });
            
            doc.save(`medical-records-${Date.now()}.pdf`);
        }

        // Inventory functions
        function addInventory(event) {
            event.preventDefault();
            
            const item = {
                id: Date.now(),
                item: document.getElementById('inventoryItem').value,
                category: document.getElementById('inventoryCategory').value,
                stock: parseInt(document.getElementById('inventoryStock').value),
                unit: document.getElementById('inventoryUnit').value,
                reorder: parseInt(document.getElementById('inventoryReorder').value)
            };
            
            inventoryData.push(item);
            localStorage.setItem('farmInventory', JSON.stringify(inventoryData));
            
            closeModal('addInventoryModal');
            document.getElementById('addInventoryForm').reset();
            loadInventory();
            
            alert('Inventory item added successfully!');
        }

        function loadInventory() {
            const tbody = document.getElementById('inventoryTable');
            tbody.innerHTML = '';
            
            inventoryData.forEach(item => {
                const status = item.stock <= item.reorder ? 
                    '<span class="status-badge status-cancelled">Low Stock</span>' : 
                    '<span class="status-badge status-completed">In Stock</span>';
                
                const row = `
                    <tr>
                        <td>${item.item}</td>
                        <td>${item.category}</td>
                        <td>${item.stock}</td>
                        <td>${item.unit}</td>
                        <td>${item.reorder}</td>
                        <td>${status}</td>
                        <td>
                            <button class="btn btn-danger btn-small" onclick="deleteInventory(${item.id})">Delete</button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        }

        function deleteInventory(id) {
            if (confirm('Are you sure?')) {
                inventoryData = inventoryData.filter(i => i.id !== id);
                localStorage.setItem('farmInventory', JSON.stringify(inventoryData));
                loadInventory();
            }
        }

        // Media management
        function showMediaSection(type) {
            document.querySelectorAll('.media-section').forEach(s => s.style.display = 'none');
            document.getElementById(`${type}Media`).style.display = 'block';
        }

        function handleImageUpload(event, type) {
            const files = event.target.files;
            if (!files.length) return;
            
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const mediaItem = {
                        id: Date.now() + Math.random(),
                        type: type,
                        url: e.target.result,
                        name: file.name,
                        uploadedAt: new Date().toISOString()
                    };
                    
                    const mediaLibrary = JSON.parse(localStorage.getItem('farmMedia') || '[]');
                    mediaLibrary.push(mediaItem);
                    localStorage.setItem('farmMedia', JSON.stringify(mediaLibrary));
                    
                    loadAllMedia();
                };
                reader.readAsDataURL(file);
            });
        }

        function addVideo(event) {
            event.preventDefault();
            
            const video = {
                id: Date.now(),
                type: 'videos',
                title: document.getElementById('videoTitle').value,
                description: document.getElementById('videoDescription').value,
                url: document.getElementById('videoUrl').value,
                thumbnail: document.getElementById('videoThumbnail').value,
                uploadedAt: new Date().toISOString()
            };
            
            const mediaLibrary = JSON.parse(localStorage.getItem('farmMedia') || '[]');
            mediaLibrary.push(video);
            localStorage.setItem('farmMedia', JSON.stringify(mediaLibrary));
            
            // Also update videos in main storage
            const videos = JSON.parse(localStorage.getItem('farmVideos') || '[]');
            videos.push({
                title: video.title,
                description: video.description,
                thumbnail: video.thumbnail,
                url: video.url
            });
            localStorage.setItem('farmVideos', JSON.stringify(videos));
            
            closeModal('addVideoModal');
            document.getElementById('addVideoForm').reset();
            loadAllMedia();
            
            alert('Video added successfully!');
        }

        function loadAllMedia() {
            const mediaLibrary = JSON.parse(localStorage.getItem('farmMedia') || '[]');
            
            // Load products media
            const productGrid = document.getElementById('productMediaGrid');
            const productMedia = mediaLibrary.filter(m => m.type === 'products');
            productGrid.innerHTML = productMedia.map(item => `
                <div class="media-item">
                    <span class="media-type-badge">Product</span>
                    <img src="${item.url}" alt="${item.name}" loading="lazy">
                    <div class="media-item-overlay">
                        <button class="btn btn-small btn-danger" onclick="deleteMedia(${item.id})">Delete</button>
                    </div>
                </div>
            `).join('');
            
            // Load videos media
            const videoGrid = document.getElementById('videoMediaGrid');
            const videoMedia = mediaLibrary.filter(m => m.type === 'videos');
            videoGrid.innerHTML = videoMedia.map(item => `
                <div class="media-item">
                    <span class="media-type-badge">Video</span>
                    <img src="${item.thumbnail}" alt="${item.title}" loading="lazy">
                    <div class="media-item-overlay">
                        <button class="btn btn-small btn-danger" onclick="deleteMedia(${item.id})">Delete</button>
                    </div>
                </div>
            `).join('');
            
            // Load gallery media
            const galleryGrid = document.getElementById('galleryMediaGrid');
            const galleryMedia = mediaLibrary.filter(m => m.type === 'gallery');
            galleryGrid.innerHTML = galleryMedia.map(item => `
                <div class="media-item">
                    <span class="media-type-badge">Gallery</span>
                    <img src="${item.url}" alt="${item.name}" loading="lazy">
                    <div class="media-item-overlay">
                        <button class="btn btn-small btn-danger" onclick="deleteMedia(${item.id})">Delete</button>
                    </div>
                </div>
            `).join('');
            
            updateStats();
        }

        function deleteMedia(id) {
            if (confirm('Delete this media item?')) {
                let mediaLibrary = JSON.parse(localStorage.getItem('farmMedia') || '[]');
                mediaLibrary = mediaLibrary.filter(m => m.id !== id);
                localStorage.setItem('farmMedia', JSON.stringify(mediaLibrary));
                loadAllMedia();
            }
        }

        // Website content management
        function saveWebsiteContent() {
            const content = {
                heroTitle: document.getElementById('heroTitle').value,
                heroSubtitle: document.getElementById('heroSubtitle').value,
                heroButton: document.getElementById('heroButton').value,
                aboutPara1: document.getElementById('aboutPara1').value,
                aboutPara2: document.getElementById('aboutPara2').value,
                aboutPara3: document.getElementById('aboutPara3').value,
                contactAddress: document.getElementById('contactAddress').value,
                contactPhone: document.getElementById('contactPhone').value,
                contactEmail: document.getElementById('contactEmail').value
            };
            
            localStorage.setItem('websiteContent', JSON.stringify(content));
            alert('Website content saved successfully!');
        }

        // Settings
        function saveSettings() {
            const settings = {
                notificationEmail: document.getElementById('notificationEmail').value,
                senderName: document.getElementById('senderName').value,
                farmName: document.getElementById('farmName').value,
                currency: document.getElementById('currency').value
            };
            
            localStorage.setItem('farmSettings', JSON.stringify(settings));
            alert('Settings saved successfully!');
        }

        // Update stats
        function updateStats() {
            document.getElementById('totalCustomers').textContent = customersData.length;
            document.getElementById('pendingOrders').textContent = ordersData.length;
            const mediaLibrary = JSON.parse(localStorage.getItem('farmMedia') || '[]');
            document.getElementById('totalMedia').textContent = mediaLibrary.length;
        }

        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('saleDate').value = today;
        document.getElementById('medicalDate').value = today;

        // Initialize
        loadCustomers();
        loadSales();
        updateStats();


// ===== Linking helpers =====
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.altKey && (e.key === 'h' || e.key === 'H')) {
    window.location.href = 'index.html';
  }
});