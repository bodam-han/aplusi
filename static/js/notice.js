let currentPage = 1;
let isLastPage = false;

async function fetchNotices(page = 1) {
    try {
        const response = await fetch('/static/notice.json');
        const dbNotices = await response.json();

        if (dbNotices.length === 0 || page > 1) {
            isLastPage = true;
            alert('최대 페이지입니다.');
            currentPage = 1;
            return;
        }

        const fixed = dbNotices.filter(n => n.is_fixed);
        const normal = dbNotices.filter(n => !n.is_fixed);

        renderFixedNotices(fixed);
        renderNotices(normal);
    } catch (error) {
        console.error('공지사항 불러오기 실패:', error);
    }
}

// 고정 공지 렌더링 (맨 위에 표시)
function renderFixedNotices(notices) {
    const container = document.getElementById('notice-list');
    if (!container) return;

    container.innerHTML = ''; // 기존 내용 초기화

    notices.forEach(notice => {
        const card = document.createElement('div');
        card.classList.add('notice-card');
        card.innerHTML = `
            <a href="./${notice.link}">
                <img src="${notice.image}" alt="썸네일" class="notice-thumb">
                <div class="notice-info">
                    <h3 class="notice-title">
                        ${notice.is_fixed ? '<span class="fixed-pin">📌</span>' : ''}
                        ${notice.title}
                    </h3>
                    <p class="notice-meta">작성일: ${notice.date} | 조회수: ${notice.views}</p>
                </div>
            </a>
        `;
        container.appendChild(card);
    });
}

// 일반 공지 렌더링 (고정 공지 아래에 표시)
function renderNotices(notices) {
    const container = document.getElementById('notice-list');
    if (!container) return;

    // 고정 공지들이 이미 추가되어 있으므로 빈칸 초기화하지 않음
    // 대신 일반 공지들을 추가

    const totalSlots = 5;
    const noticesToRender = notices.slice(0, totalSlots);
    const emptySlots = totalSlots - noticesToRender.length;

    noticesToRender.forEach(notice => {
        const card = document.createElement('div');
        card.classList.add('notice-card');
        card.innerHTML = `
            <a href="${notice.link}">
                <img src="${notice.image}" alt="썸네일" class="notice-thumb">
                <div class="notice-info">
                    <h3 class="notice-title">${notice.title}</h3>
                    <p class="notice-meta">작성일: ${notice.date} | 조회수: ${notice.views}</p>
                </div>
            </a>
        `;
        container.appendChild(card);
    });

    for (let i = 0; i < emptySlots; i++) {
        const card = document.createElement('div');
        card.classList.add('notice-card');
        card.innerHTML = `
            <a href="#" class="placeholder-link">
                <img src="./static/notice_png/empty.svg" alt="썸네일" class="notice-thumb">
                <div class="notice-info">
                    <h3 class="notice-title">공지사항 없음</h3>
                    <p class="notice-meta">작성일: - | 조회수: -</p>
                </div>
            </a>
        `;
        container.appendChild(card);
    }

    document.querySelectorAll('.placeholder-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            alert('내용이 없습니다.');
            window.location.href = '/notice.html';
        });
    });
}

// 고정 공지를 먼저 렌더링하고, 일반 공지를 불러오는 방식
document.addEventListener('DOMContentLoaded', () => {
    fetchNotices();  // 첫 페이지 불러오기

    const loadMoreBtn = document.querySelector('#load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            if (isLastPage) {
                alert('더 이상 내용이 없습니다.');
            } else {
                currentPage++;
                fetchNotices(currentPage);
            }
        });
    }
});

async function checkAdmin() {
    try {
        const authResponse = await fetch('http://127.0.0.1:5000/auth/status', {
            credentials: 'include'  // 세션 쿠키 포함
        });
        const authStatus = await authResponse.json();
        console.log("인증 상태 확인:", authStatus);

        if (authStatus.user && authStatus.user.isAdmin === 1) {
            const writeBtn = document.createElement('button');
            writeBtn.innerText = '글쓰기';
            writeBtn.classList.add('write-btn');
            writeBtn.onclick = () => location.href = '/write_notice.html';

            const container = document.querySelector('.notice-container');
            if (container) {
                container.prepend(writeBtn);
            } else {
                console.error('.notice-container 요소가 없습니다.');
            }
        }
    } catch (error) {
        console.error('관리자 체크 실패:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await checkAdmin();
});