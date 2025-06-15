let currentPage = 1;
let isLastPage = false;

async function fetchNotices(page = 1) {
    try {
        const response = await fetch('/static/tip.json');
        const dbNotices = await response.json();

        if (dbNotices.length === 0) {
            isLastPage = true;
            alert('더 이상 내용이 없습니다.');
            return;
        }

        const fixed = dbNotices.filter(tip => tip.is_fixed);
        const normal = dbNotices.filter(tip => !tip.is_fixed);

        renderFixedNotices(fixed);
        renderNotices(normal); // 정상적으로 tip 참조
    } catch (error) {
        console.error('대학생활 팁 불러오기 실패:', error);
    }
}

function renderFixedNotices(fixedNotices) {
    const container = document.getElementById('tip-list');
    if (!container) return;

    container.innerHTML = ''; // 기존 내용 초기화

    fixedNotices.forEach(tip => {
        if (!tip || !tip.title || !tip.link || !tip.image || !tip.date || !tip.views) return;
        const card = document.createElement('div');
        card.classList.add('tip-card');
        card.innerHTML = `
            <a href="./${tip.link}">
                <img src="${tip.image}" alt="썸네일" class="tip-thumb">
                <div class="tip-info">
                    <h3 class="tip-title">
                        ${tip.is_fixed ? '<span class="fixed-pin">📌</span>' : ''}
                        ${tip.title}
                    </h3>
                    <p class="tip-meta">작성일: ${tip.date} | 조회수: ${tip.views}</p>
                </div>
            </a>
        `;
        container.appendChild(card);
    });
}

// 일반 공지 렌더링 (고정 공지 아래에 표시) - 실제 tip.json 데이터로 렌더링
function renderNotices(notices) {
    const container = document.getElementById('tip-list');
    if (!container) return;

    // 고정 공지 이후, 일반 공지만 추가로 렌더링해야 하므로 기존 내용이 비어있지 않으면 그대로 두기 (고정 공지 render 후 호출됨)
    // 만약 고정 공지 renderFixedNotices가 항상 container.innerHTML을 비우면, 여기서 다시 비울 필요 없음
    // 하지만 혹시 모르니, 만약 고정 공지가 없으면 여기서 비워줌
    if (container.childElementCount === 0) {
        container.innerHTML = '';
    }

    const totalToRender = 5;
    const startIdx = (currentPage - 1) * totalToRender;
    const endIdx = startIdx + totalToRender;
    let noticesToRender = [];

    // 실제 tip이 1개 이하일 때도 정상적으로 보여주고, 나머지는 placeholder로 채우기
    if (notices.length < 1) {
        // 아무 팁도 없으면 모두 placeholder
        noticesToRender = [];
    } else {
        // 1개 이상이면 잘라서 보여주기
        noticesToRender = notices.slice(startIdx, endIdx);
    }

    // placeholders로 5개 채우기
    while (noticesToRender.length < totalToRender) {
        noticesToRender.push({
            tip_id: `empty-${noticesToRender.length}`,
            title: '등록된 꿀팁이 없습니다.',
            date: '-',
            views: '-',
            link: '#',
            image: './static/tip_png/empty.svg',
            is_fixed: false,
            is_placeholder: true
        });
    }

    noticesToRender.forEach(tip => {
        if (!tip) return;
        const card = document.createElement('div');
        card.classList.add('tip-card');

        if (tip.is_placeholder) {
            card.innerHTML = `
                <a href="#" class="placeholder-link">
                    <img src="${tip.image || './static/tip_png/empty.svg'}" alt="썸네일" class="tip-thumb">
                    <div class="tip-info">
                        <h3 class="tip-title">${tip.title || '등록된 꿀팁이 없습니다.'}</h3>
                        <p class="tip-meta">작성일: ${tip.date || '-'} | 조회수: ${tip.views || '-'}</p>
                    </div>
                </a>
            `;
        } else {
            // 검증 추가
            const title = tip.title || '제목 없음';
            const link = tip.link || '#';
            const image = tip.image || './static/tip_png/empty.svg';
            const date = tip.date || '-';
            const views = tip.views || '-';
            const is_fixed = tip.is_fixed || false;

            card.innerHTML = `
                <a href="./${link}">
                    <img src="${image}" alt="썸네일" class="tip-thumb">
                    <div class="tip-info">
                        <h3 class="tip-title">
                            ${is_fixed ? '<span class="fixed-pin">📌</span>' : ''}
                            ${title}
                        </h3>
                        <p class="tip-meta">작성일: ${date} | 조회수: ${views}</p>
                    </div>
                </a>
            `;
        }

        container.appendChild(card);
    });

    // placeholder 안내 클릭 이벤트
    document.querySelectorAll('.placeholder-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            alert('등록된 꿀팁이 없습니다.');
            window.location.href = '/tip.html';
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

    document.querySelectorAll('.page-btn').forEach(button => {
        button.addEventListener('click', () => {
            const page = button.dataset.page;
            if (page === 'first') {
                currentPage = 1;
                fetchNotices(currentPage);
            } else if (page === 'last') {
                fetch('/static/tip.json')
                    .then(response => response.json())
                    .then(dbNotices => {
                        const normal = dbNotices.filter(tip => !tip.is_fixed);
                        const totalToRender = 5;
                        const lastPage = Math.ceil(normal.length / totalToRender);
                        currentPage = lastPage;
                        fetchNotices(lastPage);
                    });
            } else if (page === 'first') {
                currentPage = 1;
                fetchNotices(1);
            } else {
                const numericPage = parseInt(page);
                if (!isNaN(numericPage)) {
                    currentPage = numericPage;
                    fetchNotices(numericPage);
                }
            }
        });
    });
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

            const container = document.querySelector('.tip-container');
            if (container) {
                container.prepend(writeBtn);
            } else {
                console.error('.tip-container 요소가 없습니다.');
            }
        }
    } catch (error) {
        console.error('관리자 체크 실패:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await checkAdmin();
});