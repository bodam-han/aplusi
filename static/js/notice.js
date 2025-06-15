const fixedNotices = [
    {
        id: 'aiplus-guide',
        title: '[사용법] 에이쁠아이 이용 가이드',
        date: '2025-06-10',
        views: '-',
        link: 'fixed_notice_1.html',
        is_fixed: true,
        image: './static/notice_png/aiplus_guide.png'
    }
];

let currentPage = 1;
let isLastPage = false;

async function fetchNotices(page = 1) {
    try {
        const response = await fetch('/notices.json');
        const dbNotices = await response.json();

        if (dbNotices.length === 0) {
            isLastPage = true;
            alert('더 이상 내용이 없습니다.');
            return;
        }

        renderNotices(dbNotices);
    } catch (error) {
        console.error('공지사항 불러오기 실패:', error);
    }
}

// 고정 공지 렌더링 (맨 위에 표시)
function renderFixedNotices() {
    const container = document.getElementById('notice-list');
    if (!container) return;

    fixedNotices.forEach(notice => {
        const card = document.createElement('div');
        card.classList.add('notice-card');
        card.innerHTML = `
            <a href="${notice.link}">
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

    const placeholders = Array(5).fill().map((_, i) => ({
        notice_id: `empty-${i}`,
        notice_title: '공지사항 없음',
        date: '-',
        views: '-',
        is_fixed: false,
        is_placeholder: true
    }));

    placeholders.forEach(notice => {
        const card = document.createElement('div');
        card.classList.add('notice-card');
        card.innerHTML = `
            <a href="#" class="placeholder-link">
                <img src="./static/notice_png/empty.svg" alt="썸네일" class="notice-thumb">
                <div class="notice-info">
                    <h3 class="notice-title">${notice.notice_title}</h3>
                    <p class="notice-meta">작성일: ${notice.date} | 조회수: ${notice.views}</p>
                </div>
            </a>
        `;
        container.appendChild(card);
    });

    // 클릭 시 알림 처리
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
    renderFixedNotices();  // 먼저 고정 공지 렌더링
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