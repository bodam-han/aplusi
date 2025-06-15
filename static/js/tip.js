const fixedNotices = [
    {
        id: 'mail-guide',
        title: '[대학생활 Tip] 교수님께 메일 잘 쓰는 법',
        date: '2025-06-10',
        views: '-',
        link: 'tip_1.html',
        is_fixed: true,
        image: 'tip_png/tip_1.png'
    }
];

let currentPage = 1;
let isLastPage = false;

async function fetchNotices(page = 1) {
    try {
        const response = await fetch('/tip.json');
        const dbNotices = await response.json();

        if (dbNotices.length === 0) {
            isLastPage = true;
            alert('더 이상 내용이 없습니다.');
            return;
        }

        renderNotices(dbNotices);
    } catch (error) {
        console.error('내용 불러오기 실패:', error);
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

// 일반 공지 렌더링 (고정 공지 아래에 표시) - 실제 tip.json 데이터로 렌더링
function renderNotices(notices) {
    const container = document.getElementById('notice-list');
    if (!container) return;

    const totalToRender = 5;
    const noticesToRender = [...notices];

    while (noticesToRender.length < totalToRender) {
        noticesToRender.push({
            tip_id: `empty-${noticesToRender.length}`,
            tip_title: '등록된 꿀팁이 없습니다.',
            date: '-',
            views: '-',
            link: '#',
            image: 'tip_png/empty.svg',
            is_fixed: false
        });
    }

    noticesToRender.slice(0, totalToRender).forEach(notice => {
        const card = document.createElement('div');
        card.classList.add('notice-card');
        card.innerHTML = `
            <a href="${notice.link}">
                <img src="${notice.image}" alt="썸네일" class="notice-thumb">
                <div class="notice-info">
                    <h3 class="notice-title">
                        ${notice.is_fixed ? '<span class="fixed-pin">📌</span>' : ''}
                        ${notice.tip_title}
                    </h3>
                    <p class="notice-meta">작성일: ${notice.date} | 조회수: ${notice.views}</p>
                </div>
            </a>
        `;
        container.appendChild(card);
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
        const authResponse = await fetch('/auth/status', {
            credentials: 'include'  // 세션 쿠키 포함
        });
        const authStatus = await authResponse.json();
        console.log("인증 상태 확인:", authStatus);

        if (authStatus.user && authStatus.user.isAdmin === 1) {
            const writeBtn = document.createElement('button');
            writeBtn.innerText = '글쓰기';
            writeBtn.classList.add('write-btn');
            writeBtn.onclick = () => location.href = '/write_tip.html';

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