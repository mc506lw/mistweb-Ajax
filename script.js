document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('nav ul li a');
    const content = document.getElementById('content');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const pages = document.querySelectorAll('.page');
    const pageIndicator = document.getElementById('page-indicator');
    let currentPage = 0;
    let isThrottled = false;

    // 初始化四边形标识的位置
    moveIndicator(links[currentPage]);

    links.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage !== index) {
                currentPage = index;
                const page = link.getAttribute('data-page');
                loadPage(page, () => {
                    moveIndicator(link);
                    applyPageTransition();
                });
            }
        });
    });

    function loadPage(page, callback) {
        loadingSpinner.style.display = 'block';
        fetch(`${page}.html`)
            .then(response => response.text())
            .then(html => {
                pages.forEach(p => p.classList.remove('active'));
                setTimeout(() => {
                    document.getElementById('page1').innerHTML = html;
                    loadingSpinner.style.display = 'none';
                    pages[0].classList.add('active');
                    handlePageSpecificLogic(page);
                    if (callback) callback();
                }, 500); // 加入延时以模拟动画效果
            })
            .catch(error => console.error('Error loading page:', error));
    }

    function handlePageSpecificLogic(page) {
        if (page === 'join') {
            updateJoinPage();
        }

        if (page === 'home') {
            setupJoinDivClickListener();
        }

        if (page === 'play') {
            initCarousel();
        }

        if (page === 'photo') {
            photoinitCarousel();
        }
    }

    function setupJoinDivClickListener() {
        const joinDiv = document.querySelector('.join-title');
        if (joinDiv) {
            joinDiv.addEventListener('click', () => {
                const joinPage = joinDiv.getAttribute('data-page');
                currentPage = Array.from(links).findIndex(link => link.getAttribute('data-page') === joinPage);
                loadPage(joinPage, () => {
                    moveIndicator(links[currentPage]);
                    applyPageTransition();
                });
            });
        } else {
            console.error('Element .join-title not found after home page load');
        }
    }

    function updateJoinPage() {
        const targetDate = new Date('2024-02-02');
        const daysDifference = Math.abs(Math.ceil((targetDate - new Date()) / (1000 * 60 * 60 * 24)));
        const serverTimeElement = document.getElementById('server-time');

        if (serverTimeElement) {
            serverTimeElement.textContent = `已经开服: ${daysDifference}天`;
        }

        let count = 0;
        const maxCount = 123; 
        const slowDownPoint = maxCount - 16;
        const totalTime = 3000;
        const fastSpeed = totalTime * (slowDownPoint / maxCount) / slowDownPoint;
        const slowSpeed = totalTime * ((maxCount - slowDownPoint) / maxCount) / (maxCount - slowDownPoint);
        let intervalId = setInterval(updateCounter, fastSpeed);

        function updateCounter() {
            count++;
            if (count >= maxCount) {
                clearInterval(intervalId);
                return;
            }
            document.querySelector('#player-count').textContent = `服务玩家: ${count} 名`;

            clearInterval(intervalId);
            intervalId = setInterval(updateCounter, (count < slowDownPoint) ? fastSpeed : slowSpeed);
        }
    }

    window.addEventListener('wheel', (e) => {
        if (isThrottled) return;

        currentPage = (e.deltaY > 0) ? (currentPage + 1) % links.length : (currentPage - 1 + links.length) % links.length;
        const page = links[currentPage].getAttribute('data-page');
        loadPage(page, () => {
            moveIndicator(links[currentPage]);
            applyPageTransition();
        });

        isThrottled = true;
        setTimeout(() => {
            isThrottled = false;
        }, 1000);
    });

    function moveIndicator(targetLink) {
        const linkPosition = targetLink.getBoundingClientRect();
        const navPosition = targetLink.closest('nav').getBoundingClientRect();
        pageIndicator.classList.remove('show');
        pageIndicator.classList.add('hide');

        setTimeout(() => {
            pageIndicator.style.left = `${linkPosition.left - navPosition.left + linkPosition.width / 2 - 20}px`;
        }, 500);

        setTimeout(() => {
            pageIndicator.classList.remove('hide');
            pageIndicator.classList.add('show');
        }, 500);
    }

    function applyPageTransition() {
        pages[0].classList.add('page-transition'); // 添加过渡动画类
        setTimeout(() => {
            pages[0].classList.remove('page-transition');
        }, 500); // 动画持续时间与 CSS 中的动画持续时间匹配
    }

    // 默认加载主页
    loadPage('home');

    const audio = document.getElementById('audio');
    const musicPlayerImg = document.getElementById('musicPlayer');
    let isPlaying = false;

    audio.volume = 0.1;

    musicPlayerImg.addEventListener('click', togglePlayPause);

    function togglePlayPause() {
        if (isPlaying) {
            audio.pause();
            musicPlayerImg.src = 'https://img.picui.cn/free/2024/08/27/66cd353b6accc.png';
        } else {
            audio.play();
            musicPlayerImg.src = 'https://img.picui.cn/free/2024/08/27/66cd34563b90d.png';
        }
        isPlaying = !isPlaying;
    }

    function initCarousel() {
        const photos = [
            { src: 'https://s21.ax1x.com/2024/08/28/pAAuSQs.png', title: '红石', description: '使用红石进行复杂电路的设计与实现', date: 'Redstone' },
            { src: 'https://s21.ax1x.com/2024/08/28/pAAuFoT.png', title: '建筑', description: '构建壮观建筑，探索无限创意', date: 'Building' },
            { src: 'https://s21.ax1x.com/2024/08/28/pAAnjJg.png', title: '粘液', description: '科技与生产，效率至上', date: 'SlimeFun' },
            { src: 'https://s21.ax1x.com/2024/08/28/pAAnvWQ.png', title: '生电', description: '巧思妙想，创造巅峰机械', date: 'Redstone Powercraft' },
            { src: 'https://s21.ax1x.com/2024/08/28/pAAupyn.png', title: '探索', description: '探索未知领域，发掘隐藏宝藏', date: 'Exploration' }
        ];

        let currentIndex = 0;  

        function updateCarousel() {
            const photoElement = document.querySelector('.play-photo');
            const titleElement = document.querySelector('.play-info h2');
            const descriptionElement = document.querySelector('.play-info p');
            const dateElement = document.querySelector('.play-date');

            photoElement.style.backgroundImage = `url(${photos[currentIndex].src})`;
            titleElement.textContent = photos[currentIndex].title;
            descriptionElement.textContent = photos[currentIndex].description;
            dateElement.textContent = photos[currentIndex].date;
        }

        function nextPhoto() {
            currentIndex = (currentIndex + 1) % photos.length;  
            updateCarousel();  
        }

        function previousPhoto() {
            currentIndex = (currentIndex - 1 + photos.length) % photos.length;  
            updateCarousel();  
        }

        updateCarousel();

        document.querySelector('.play-info-next').addEventListener('click', nextPhoto);
        document.querySelector('.play-info-previous').addEventListener('click', previousPhoto);
    }

    function photoinitCarousel() {
        const images = [
            {
                src: "https://s21.ax1x.com/2024/08/30/pAAqhq0.png",
                footer: "现代运输系统-速度至上",
                number: "01/05",
                numberBottom: "FERVOR TO FOREVER"
            },
            {
                src: "https://s21.ax1x.com/2024/08/28/pAAuFoT.png",
                footer: "精致装饰-建筑设计",
                number: "02/05",
                numberBottom: "FERVOR TO FOREVER"
            },
            {
                src: "https://s21.ax1x.com/2024/08/30/pAAq7iF.png",
                footer: "红石计算器-与或门",
                number: "03/05",
                numberBottom: "FERVOR TO FOREVER"
            },
            {
                src: "https://s21.ax1x.com/2024/08/30/pAAq5ZV.png",
                footer: "樱花 别墅 与 生活",
                number: "04/05",
                numberBottom: "FERVOR TO FOREVER"
            },
            {
                src: "https://s21.ax1x.com/2024/08/30/pAAqIaT.png",
                footer: "自研物品分类机-红石力Max",
                number: "05/05",
                numberBottom: "FERVOR TO FOREVER"
            }
        ];

        let currentIndex = 0;  // 初始化显示第三张图片（index为2）

        const imgElement = document.querySelector('.photo-slide-image img');
        const photoNumberElement = document.querySelector('.photo-number');
        const photoFooterElement = document.querySelector('.photo-footer');
        const photoNumberBottomElement = document.querySelector('.photo-number-bottom');

        function updateSlide() {
            imgElement.classList.remove('active');  // 移除当前的 active 类

            setTimeout(() => {
                imgElement.src = images[currentIndex].src;
                photoNumberElement.textContent = images[currentIndex].number;
                photoFooterElement.textContent = images[currentIndex].footer;
                photoNumberBottomElement.textContent = images[currentIndex].numberBottom;
                imgElement.classList.add('active');  // 添加 active 类，触发过渡动画
            }, 500);  // 设置延迟以匹配 CSS 过渡时间
        }

        document.querySelector('.prev-button').addEventListener('click', function() {
            currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
            updateSlide();
        });

        document.querySelector('.next-button').addEventListener('click', function() {
            currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
            updateSlide();
        });

        // 初始化轮播图
        updateSlide();
    }

    // 预加载每个页面的图片
    const preloadedImages = [
        // 主页图片
        'https://img.picui.cn/free/2024/08/27/66cd353b6accc.png',
        'https://img.picui.cn/free/2024/08/27/66cd34563b90d.png',
        // Play页面图片
        'https://s21.ax1x.com/2024/08/28/pAAuSQs.png',
        'https://s21.ax1x.com/2024/08/28/pAAnjJg.png',
        'https://s21.ax1x.com/2024/08/28/pAAnvWQ.png',
        'https://s21.ax1x.com/2024/08/28/pAAupyn.png',
        // Photo页面图片
        'https://s21.ax1x.com/2024/08/30/pAAqhq0.png',
        'https://s21.ax1x.com/2024/08/28/pAAuFoT.png',
        'https://s21.ax1x.com/2024/08/30/pAAq7iF.png',
        'https://s21.ax1x.com/2024/08/30/pAAq5ZV.png',
        'https://s21.ax1x.com/2024/08/30/pAAqIaT.png'
    ];

    preloadedImages.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onload = function() {
            console.log(this.src + ' 已加载并缓存');
        };
        img.onerror = function() {
            console.log(this.src + ' 加载失败');
        };
    });
});
