// 巴蜀文物非遗潮玩盲盒 - 交互脚本

document.addEventListener('DOMContentLoaded', function() {
    console.log('巴蜀文物非遗潮玩盲盒小程序已启动');
    
    // 初始化应用
    initApp();
    
    // 设置导航交互
    setupNavigation();
    
    // 初始化DIY功能
    initDIYFunctionality();
    
    // 加载盲盒系列数据
    loadSeriesData();
    
    // 加载商城数据
    loadShopData();
    
    // 设置滚动效果
    setupScrollEffects();
    
    // 设置移动端导航
    setupMobileNav();
    
    // 设置表单交互
    setupFormInteractions();
});

// 初始化应用
function initApp() {
    // 添加加载完成类
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    // 设置当前年份
    const yearElement = document.querySelector('.footer-bottom p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace('2023', currentYear);
    }
    
    // 初始化3D盲盒动画
    init3DAnimations();
}

// 设置导航交互
function setupNavigation() {
    // 桌面导航
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有active类
            navLinks.forEach(l => l.classList.remove('active'));
            
            // 添加active类到当前点击的链接
            this.classList.add('active');
            
            // 平滑滚动到对应部分
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // 系列卡片按钮
    const seriesButtons = document.querySelectorAll('.btn-series');
    seriesButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.series-card');
            const title = card.querySelector('h3').textContent;
            showToast(`预览${title}系列`);
            
            // 模拟打开系列详情
            simulateSeriesPreview(title);
        });
    });
}

// 初始化DIY功能
function initDIYFunctionality() {
    const diyBlindbox = document.getElementById('diy-blindbox');
    const partsContainer = document.getElementById('parts-container');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const colorOptions = document.querySelectorAll('.color-option');
    const viewButtons = document.querySelectorAll('.view-btn');
    const rotateBtn = document.getElementById('rotate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const saveBtn = document.getElementById('save-btn');
    
    // 当前状态
    let currentState = {
        selectedTab: 'head',
        selectedParts: {
            head: 'gold-mask',
            body: 'divine-tree',
            base: 'bronze-base',
            effect: 'mystic-glow'
        },
        currentColor: 'primary-pink',
        isRotating: false,
        rotationAngle: 0,
        currentView: 'front'
    };
    
    // 部件数据
    const partsData = {
        head: [
            { id: 'gold-mask', name: '黄金面具', icon: 'fas fa-crown', color: '#fbbf24' },
            { id: 'bronze-mask', name: '青铜面具', icon: 'fas fa-mask', color: '#92400e' },
            { id: 'face-change', name: '变脸脸谱', icon: 'fas fa-theater-masks', color: '#dc2626' },
            { id: 'panda-head', name: '熊猫头套', icon: 'fas fa-paw', color: '#000000' },
            { id: 'embroidery-hat', name: '刺绣帽饰', icon: 'fas fa-hat-cowboy', color: '#7c3aed' },
            { id: 'sun-crown', name: '太阳神冠', icon: 'fas fa-sun', color: '#f59e0b' }
        ],
        body: [
            { id: 'divine-tree', name: '神树身体', icon: 'fas fa-tree', color: '#10b981' },
            { id: 'bronze-robe', name: '青铜长袍', icon: 'fas fa-vest', color: '#4b5563' },
            { id: 'opera-costume', name: '戏服装扮', icon: 'fas fa-tshirt', color: '#ef4444' },
            { id: 'panda-body', name: '熊猫身体', icon: 'fas fa-otter', color: '#1f2937' },
            { id: 'embroidery-robe', name: '刺绣华服', icon: 'fas fa-vest-patches', color: '#8b5cf6' },
            { id: 'ritual-garment', name: '祭祀服饰', icon: 'fas fa-hands-praying', color: '#7c3aed' }
        ],
        base: [
            { id: 'bronze-base', name: '青铜底座', icon: 'fas fa-th-large', color: '#92400e' },
            { id: 'altar-base', name: '祭坛底座', icon: 'fas fa-monument', color: '#78716c' },
            { id: 'stage-base', name: '戏台底座', icon: 'fas fa-theater-masks', color: '#dc2626' },
            { id: 'bamboo-base', name: '竹编底座', icon: 'fas fa-seedling', color: '#16a34a' },
            { id: 'cloud-base', name: '祥云底座', icon: 'fas fa-cloud', color: '#93c5fd' },
            { id: 'lotus-base', name: '莲花底座', icon: 'fas fa-spa', color: '#ec4899' }
        ],
        effect: [
            { id: 'mystic-glow', name: '神秘光效', icon: 'fas fa-magic', color: '#8b5cf6' },
            { id: 'golden-light', name: '金色光芒', icon: 'fas fa-sun', color: '#fbbf24' },
            { id: 'blue-flame', name: '蓝色火焰', icon: 'fas fa-fire', color: '#3b82f6' },
            { id: 'pink-aura', name: '粉色光环', icon: 'fas fa-circle', color: '#ec4899' },
            { id: 'green-mist', name: '绿色迷雾', icon: 'fas fa-smog', color: '#10b981' },
            { id: 'rainbow-beam', name: '彩虹光束', icon: 'fas fa-rainbow', color: '#8b5cf6' }
        ]
    };
    
    // 颜色映射
    const colorMap = {
        'primary-pink': '#ec4899',
        'dark-pink': '#db2777',
        'light-pink': '#f472b6',
        'black': '#1f2937',
        'gray': '#4b5563',
        'accent': '#fbbf24'
    };
    
    // 初始化部件显示
    function loadParts(tab) {
        partsContainer.innerHTML = '';
        const parts = partsData[tab];
        
        parts.forEach(part => {
            const partElement = document.createElement('div');
            partElement.className = `part-item ${currentState.selectedParts[tab] === part.id ? 'active' : ''}`;
            partElement.dataset.partId = part.id;
            partElement.dataset.partType = tab;
            
            partElement.innerHTML = `
                <div class="part-icon">
                    <i class="${part.icon}"></i>
                </div>
                <div class="part-name">${part.name}</div>
            `;
            
            // 设置颜色
            partElement.querySelector('.part-icon').style.color = part.color;
            
            partElement.addEventListener('click', () => selectPart(tab, part.id));
            partsContainer.appendChild(partElement);
        });
    }
    
    // 选择部件
    function selectPart(type, partId) {
        currentState.selectedParts[type] = partId;
        
        // 更新UI
        updatePartSelectionUI(type, partId);
        
        // 更新3D模型
        update3DModel();
        
        // 显示反馈
        const partName = partsData[type].find(p => p.id === partId).name;
        showToast(`已选择${partName}`);
    }
    
    // 更新部件选择UI
    function updatePartSelectionUI(type, partId) {
        // 更新部件网格中的active状态
        document.querySelectorAll('.part-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.partType === type && item.dataset.partId === partId) {
                item.classList.add('active');
            }
        });
        
        // 更新3D预览中的部件标签
        const partLabel = document.querySelector(`.part[data-part="${type}"] .part-label`);
        if (partLabel) {
            const partData = partsData[type].find(p => p.id === partId);
            partLabel.textContent = partData.name;
        }
    }
    
    // 更新3D模型
    function update3DModel() {
        // 这里可以添加更复杂的3D更新逻辑
        // 目前只是更新颜色和简单的视觉效果
        
        // 应用当前颜色到模型
        applyColorToModel();
    }
    
    // 应用颜色到模型
    function applyColorToModel() {
        const currentColor = colorMap[currentState.currentColor];
        
        // 更新所有部件的背景色
        document.querySelectorAll('.part').forEach(part => {
            const originalGradient = getComputedStyle(part).backgroundImage;
            // 这里可以添加更复杂的颜色混合逻辑
        });
    }
    
    // 切换标签页
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tab = this.dataset.tab;
            
            // 更新按钮状态
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 更新当前标签
            currentState.selectedTab = tab;
            
            // 加载对应部件
            loadParts(tab);
        });
    });
    
    // 颜色选择
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            const color = this.dataset.color;
            
            // 更新颜色选项状态
            colorOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // 更新当前颜色
            currentState.currentColor = color;
            
            // 应用颜色到模型
            applyColorToModel();
            
            // 显示反馈
            showToast(`已切换为${getColorName(color)}配色`);
        });
    });
    
    // 视角切换
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const view = this.dataset.view;
            
            // 更新按钮状态
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 更新当前视角
            currentState.currentView = view;
            
            // 应用视角变换
            applyViewTransform(view);
        });
    });
    
    // 应用视角变换
    function applyViewTransform(view) {
        let transform = '';
        
        switch(view) {
            case 'front':
                transform = 'rotateX(0deg) rotateY(0deg)';
                break;
            case 'side':
                transform = 'rotateX(0deg) rotateY(-60deg)';
                break;
            case 'top':
                transform = 'rotateX(-60deg) rotateY(0deg)';
                break;
        }
        
        diyBlindbox.style.transform = transform;
    }
    
    // 旋转功能
    if (rotateBtn) {
        rotateBtn.addEventListener('click', function() {
            currentState.isRotating = !currentState.isRotating;
            
            if (currentState.isRotating) {
                this.innerHTML = '<i class="fas fa-pause"></i> 暂停';
                startRotation();
            } else {
                this.innerHTML = '<i class="fas fa-sync-alt"></i> 旋转';
                stopRotation();
            }
        });
    }
    
    // 开始旋转
    function startRotation() {
        function rotate() {
            if (currentState.isRotating) {
                currentState.rotationAngle += 1;
                diyBlindbox.style.transform = `rotateY(${currentState.rotationAngle}deg)`;
                requestAnimationFrame(rotate);
            }
        }
        rotate();
    }
    
    // 停止旋转
    function stopRotation() {
        // 旋转状态已在点击事件中更新
    }
    
    // 重置功能
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            // 重置到默认状态
            currentState = {
                selectedTab: 'head',
                selectedParts: {
                    head: 'gold-mask',
                    body: 'divine-tree',
                    base: 'bronze-base',
                    effect: 'mystic-glow'
                },
                currentColor: 'primary-pink',
                isRotating: false,
                rotationAngle: 0,
                currentView: 'front'
            };
            
            // 重置UI
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelector('.tab-btn[data-tab="head"]').classList.add('active');
            
            colorOptions.forEach(opt => opt.classList.remove('active'));
            document.querySelector('.color-option[data-color="primary-pink"]').classList.add('active');
            
            viewButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelector('.view-btn[data-view="front"]').classList.add('active');
            
            // 重新加载部件
            loadParts('head');
            
            // 重置3D模型
            diyBlindbox.style.transform = 'rotateX(0deg) rotateY(0deg)';
            update3DModel();
            
            showToast('已重置所有设置');
        });
    }
    
    // 保存功能
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            // 模拟保存设计
            const designName = `巴蜀潮玩设计_${new Date().getTime()}`;
            
            // 显示保存成功消息
            showToast(`设计"${designName}"已保存到我的作品`);
            
            // 这里可以添加实际保存逻辑，如发送到服务器或保存到本地存储
            saveDesignToLocal(designName);
        });
    }
    
    // 获取颜色名称
    function getColorName(colorKey) {
        const names = {
            'primary-pink': '主粉色',
            'dark-pink': '深粉色',
            'light-pink': '浅粉色',
            'black': '经典黑',
            'gray': '高级灰',
            'accent': '点缀金'
        };
        return names[colorKey] || colorKey;
    }
    
    // 保存设计到本地存储
    function saveDesignToLocal(designName) {
        const design = {
            name: designName,
            parts: currentState.selectedParts,
            color: currentState.currentColor,
            timestamp: new Date().toISOString()
        };
        
        // 获取现有设计
        let designs = JSON.parse(localStorage.getItem('bashuDesigns') || '[]');
        
        // 添加新设计
        designs.push(design);
        
        // 保存回本地存储
        localStorage.setItem('bashuDesigns', JSON.stringify(designs));
    }
    
    // 初始化加载
    loadParts('head');
    applyViewTransform('front');
}

// 初始化3D动画
function init3DAnimations() {
    // 英雄区域的3D盲盒自动旋转
    const heroBlindbox = document.getElementById('hero-blindbox');
    if (heroBlindbox) {
        // CSS中已有动画，这里可以添加交互控制
    }
}

// 加载盲盒系列数据
function loadSeriesData() {
    // 这里可以添加从服务器加载数据的逻辑
    // 目前数据已在HTML中硬编码
}

// 加载商城数据
function loadShopData() {
    const shopGrid = document.querySelector('.shop-grid');
    if (!shopGrid) return;
    
    // 模拟商品数据
    const products = [
        { id: 1, name: '三星堆青铜面具', series: 'sanxingdui', price: '89', rating: 4.9, badge: '热卖' },
        { id: 2, name: '川剧变脸套装', series: 'bianlian', price: '129', rating: 4.8, badge: '新品' },
        { id: 3, name: '蜀绣熊猫', series: 'shuxiu', price: '99', rating: 4.7, badge: '限定' },
        { id: 4, name: '青铜神树', series: 'sanxingdui', price: '159', rating: 4.9, badge: '典藏' },
        { id: 5, name: '变脸大师', series: 'bianlian', price: '109', rating: 4.8, badge: '新品' },
        { id: 6, name: '刺绣凤凰', series: 'shuxiu', price: '139', rating: 4.6, badge: '限量' }
    ];
    
    // 清空现有内容
    shopGrid.innerHTML = '';
    
    // 添加商品卡片
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'shop-item';
        productElement.innerHTML = `
            <div class="shop-image">
                <div class="shop-badge">${product.badge}</div>
            </div>
            <div class="shop-content">
                <h4>${product.name}</h4>
                <div class="shop-price">¥${product.price}</div>
                <div class="shop-rating">
                    ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}
                </div>
                <button class="btn-shop" data-product-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> 加入购物车
                </button>
            </div>
        `;
        
        // 设置系列对应的背景
        const shopImage = productElement.querySelector('.shop-image');
        switch(product.series) {
            case 'sanxingdui':
                shopImage.style.background = 'linear-gradient(135deg, #92400e, #fbbf24)';
                break;
            case 'bianlian':
                shopImage.style.background = 'linear-gradient(135deg, #dc2626, #f87171)';
                break;
            case 'shuxiu':
                shopImage.style.background = 'linear-gradient(135deg, #7c3aed, #c4b5fd)';
                break;
            case 'panda':
                shopImage.style.background = 'linear-gradient(135deg, #000000, #4b5563)';
                break;
        }
        
        shopGrid.appendChild(productElement);
    });
    
    // 添加购物车按钮事件
    document.querySelectorAll('.btn-shop').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const product = products.find(p => p.id == productId);
            
            if (product) {
                addToCart(product);
                showToast(`"${product.name}"已加入购物车`);
            }
        });
    });
}

// 添加到购物车
function addToCart(product) {
    // 获取现有购物车
    let cart = JSON.parse(localStorage.getItem('bashuCart') || '[]');
    
    // 检查是否已存在
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            series: product.series
        });
    }
    
    // 保存回本地存储
    localStorage.setItem('bashuCart', JSON.stringify(cart));
    
    // 更新购物车数量显示
    updateCartCount();
}

// 更新购物车数量
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('bashuCart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// 设置滚动效果
function setupScrollEffects() {
    let lastScrollTop = 0;
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 向下滚动时隐藏头部，向上滚动时显示
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            if (header) {
                header.style.transform = 'translateY(-100%)';
                header.style.transition = 'transform 0.3s ease';
            }
        } else {
            if (header) {
                header.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollTop = scrollTop;
        
        // 添加滚动到顶部按钮
        showScrollToTopButton(scrollTop);
    });
}

// 设置移动端导航
function setupMobileNav() {
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    
    mobileNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有active类
            mobileNavItems.forEach(i => i.classList.remove('active'));
            
            // 添加active类到当前点击的项
            this.classList.add('active');
            
            // 如果是链接，平滑滚动
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 60,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// 设置表单交互
function setupFormInteractions() {
    // 订阅表单
    const subscribeForm = document.querySelector('.newsletter');
    if (subscribeForm) {
        const input = subscribeForm.querySelector('input');
        const button = subscribeForm.querySelector('.btn-subscribe');
        
        button.addEventListener('click', function() {
            if (input.value && isValidEmail(input.value)) {
                showToast('感谢订阅！您将收到最新盲盒信息');
                input.value = '';
                
                // 这里可以添加实际订阅逻辑
            } else {
                showToast('请输入有效的邮箱地址');
                input.focus();
            }
        });
        
        // 按Enter键提交
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                button.click();
            }
        });
    }
    
    // 筛选按钮
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有active类
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // 添加active类到当前点击的按钮
            this.classList.add('active');
            
            // 获取筛选条件
            const filter = this.textContent;
            
            // 模拟筛选商品
            filterShopItems(filter);
            
            // 显示反馈
            if (filter !== '全部系列') {
                showToast(`已筛选${filter}系列`);
            }
        });
    });
    
    // 加载更多按钮
    const loadMoreBtn = document.querySelector('.btn-load-more');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spinner loading"></i> 加载中...';
            
            // 模拟加载更多数据
            setTimeout(() => {
                simulateLoadMoreProducts();
                this.innerHTML = '<i class="fas fa-sync-alt"></i> 加载更多盲盒';
                showToast('已加载更多盲盒商品');
            }, 1500);
        });
    }
}

// 邮箱验证
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 筛选商品
function filterShopItems(filter) {
    const shopItems = document.querySelectorAll('.shop-item');
    
    shopItems.forEach(item => {
        // 这里可以根据实际数据添加筛选逻辑
        // 目前只是模拟
        if (filter === '全部系列') {
            item.style.display = 'block';
        } else {
            // 随机显示/隐藏来模拟筛选
            item.style.display = Math.random() > 0.5 ? 'block' : 'none';
        }
    });
}

// 模拟加载更多商品
function simulateLoadMoreProducts() {
    const shopGrid = document.querySelector('.shop-grid');
    if (!shopGrid) return;
    
    // 添加更多模拟商品
    const moreProducts = [
        { id: 7, name: '青铜太阳轮', series: 'sanxingdui', price: '119', rating: 4.8, badge: '新品' },
        { id: 8, name: '川剧小生', series: 'bianlian', price: '89', rating: 4.7, badge: '热卖' },
        { id: 9, name: '蜀锦鲤鱼', series: 'shuxiu', price: '149', rating: 4.9, badge: '限定' }
    ];
    
    moreProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'shop-item';
        productElement.innerHTML = `
            <div class="shop-image">
                <div class="shop-badge">${product.badge}</div>
            </div>
            <div class="shop-content">
                <h4>${product.name}</h4>
                <div class="shop-price">¥${product.price}</div>
                <div class="shop-rating">
                    ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}
                </div>
                <button class="btn-shop" data-product-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> 加入购物车
                </button>
            </div>
        `;
        
        shopGrid.appendChild(productElement);
    });
    
    // 重新绑定事件
    document.querySelectorAll('.btn-shop').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            showToast(`商品ID: ${productId} 已加入购物车`);
        });
    });
}

// 模拟系列预览
function simulateSeriesPreview(seriesName) {
    // 这里可以添加打开系列详情页面的逻辑
    // 目前只是显示一个模拟的模态框
    console.log(`打开${seriesName}系列详情`);
}

// 显示Toast提示
function showToast(message) {
    // 移除现有的toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // 创建toast元素
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--black-primary);
        color: white;
        padding: 12px 24px;
        border-radius: var(--radius-lg);
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.3s;
        font-size: var(--font-size-sm);
        box-shadow: var(--shadow-3d);
        max-width: 80%;
        text-align: center;
    `;
    
    document.body.appendChild(toast);
    
    // 显示toast
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 10);
    
    // 3秒后隐藏并移除toast
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 3000);
}

// 显示滚动到顶部按钮
function showScrollToTopButton(scrollTop) {
    let button = document.querySelector('.scroll-to-top');
    
    if (scrollTop > 300) {
        if (!button) {
            button = document.createElement('button');
            button.className = 'scroll-to-top';
            button.innerHTML = '<i class="fas fa-chevron-up"></i>';
            button.style.cssText = `
                position: fixed;
                bottom: 80px;
                right: 20px;
                width: 44px;
                height: 44px;
                border-radius: 50%;
                background-color: var(--pink-primary);
                color: white;
                border: none;
                cursor: pointer;
                z-index: 999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                box-shadow: var(--shadow-lg);
                transition: transform 0.3s, opacity 0.3s;
                opacity: 0;
            `;
            
            button.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            document.body.appendChild(button);
            
            // 添加动画
            setTimeout(() => {
                button.style.opacity = '1';
            }, 10);
        }
    } else if (button) {
        button.style.opacity = '0';
        setTimeout(() => {
            if (button && button.parentNode) {
                button.remove();
            }
        }, 300);
    }
}

// 页面加载完成后初始化购物车数量
window.addEventListener('load', function() {
    updateCartCount();
});
