document.addEventListener('DOMContentLoaded', () => {
  // Header
  const viewHeader = document.querySelector('#view-header');
  const settingsHeader = document.querySelector('#settings-header');
  const orderEditHeader = document.querySelector('#order-edit-header');
  const slideEditHeader = document.querySelector('#slide-edit-header');

  // Main Section
  const listView = document.querySelector('#list-view');
  const settings = document.querySelector('#settings');
  const slideEdit = document.querySelector('#slide-edit');
  const orderEdit = document.querySelector('#order-edit');
  
  // Button
  const listButton = document.querySelector('#btn-list');
  const backToViewButtons = document.querySelectorAll('#btn-back-to-view');
  const backToListButton = document.querySelector('#btn-back-to-list');
  const backfromSlideButton = document.querySelector('#btn-back-from-slide');
  const orderButton = document.querySelector('#btn-order');
  const createButton = document.querySelector('#btn-create');
  const orderUpButton = document.querySelector('#btn-order-up');
  const orderDownButton = document.querySelector('#btn-order-down');
  const applyOrderButton = document.querySelector('#btn-apply-order');
  const applySlideButton = document.querySelector('#btn-apply-slide');

  // Container
  const viewContainer = document.querySelector('#view-container');
  const listContainer = document.querySelector('#list-container');
  const orderEditContainer = document.querySelector('#order-edit-container');
  
  
  // Edit
  const testMachineInput = document.querySelector('#input-test-machine');
  const modelInput = document.querySelector('#input-model');
  const purposeInput = document.querySelector('#input-purpose');
  const startDateInput = document.querySelector('#input-start-date');
  const endDateInput = document.querySelector('#input-end-date');

  // Timer
  const countdownElements = document.querySelectorAll('.countdown');
  let inactivityTimer;
  let countdownInterval;
  const INACTIVITY_TIMEOUT = 60; // 60 Seconds
  let editingOrder = null; // 현재 수정 중인 데이터의 order 값 저장

  // 비활성 타이머를 리셋하는 함수
  const resetInactivityTimer = () => {
    // 내부 타임아웃 리셋
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(showView, INACTIVITY_TIMEOUT * 1000);
    // 화면에 보이는 카운트다운도 함께 리셋
    startCountdownDisplay();
  };

  // 화면의 카운트다운을 시작하는 함수
  const startCountdownDisplay = () => {
    let remainingTime = INACTIVITY_TIMEOUT;
    countdownElements.forEach(el => el.textContent = remainingTime);
    clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
      remainingTime--;
      countdownElements.forEach(el => {
        el.textContent = remainingTime;
      });
      if (remainingTime <= 0) {
        clearInterval(countdownInterval);
      }
    }, 1000);
  };

  // 이벤트 리스너를 제거하는 함수
  const removeActivityListeners = () => {
    ['mousemove', 'keydown', 'click'].forEach(event => {
      slideEdit.removeEventListener(event, resetInactivityTimer);
      settings.removeEventListener(event, resetInactivityTimer);
    });
    clearInterval(countdownInterval);
  };

  const showView = () => {
    // Header Toggle
    viewHeader.style.display = 'flex';
    settingsHeader.style.display = 'none';
    orderEditHeader.style.display = 'none';
    slideEditHeader.style.display = 'none';

    // Main Toggle
    listView.style.display = 'flex';
    slideEdit.style.display = 'none';
    settings.style.display = 'none';

    // 타이머와 이벤트 리스너 정리
    clearTimeout(inactivityTimer);
    removeActivityListeners();

    // form 안의 모든 input, textarea 내용 초기화
    const formElements = slideEdit.querySelectorAll('input, textarea');
    formElements.forEach(element => {
      // type="date"는 value를 ''로 설정해야 초기화됨
      if (element.type === 'date') {
        element.value = '';
      } else {
        element.value = '';
      }
    });
  };

  const showList = () => {
    // List 화면으로 전환 시 폼 초기화
    // Header Toggle
    viewHeader.style.display = 'none';
    settingsHeader.style.display = 'flex';
    orderEditHeader.style.display = 'none';
    slideEditHeader.style.display = 'none';

    // Main Toggle
    listView.style.display = 'none';
    settings.style.display = 'flex';
    slideEdit.style.display = 'none';
    orderEdit.style.display = 'none';

    // 입력 폼이 보이면 타이머 시작
    updateList(); // 목록 화면으로 전환 시 데이터 로드 및 표시
    resetInactivityTimer(); // 타이머 타임아웃 시작
    
    // 사용자 활동 감지를 위한 이벤트 리스너 추가
    ['mousemove', 'keydown', 'click'].forEach(event => {
      listSection.addEventListener(event, resetInactivityTimer);
    });
  };

  const showCreateForm = () => {
    // Header Toggle
    viewHeader.style.display = 'none';
    settingsHeader.style.display = 'none';
    orderEditHeader.style.display = 'none';
    slideEditHeader.style.display = 'flex';

    // Main Toggle
    listView.style.display = 'none';
    settings.style.display = 'none';
    slideEdit.style.display = 'flex';

    // 입력 폼이 보이면 타이머 시작
    resetInactivityTimer(); // 타이머 타임아웃 시작
    
    // 사용자 활동 감지를 위한 이벤트 리스너 추가
    ['mousemove', 'keydown', 'click'].forEach(event => {
      slideEdit.addEventListener(event, resetInactivityTimer);
    });
  };

  const showOrderEdit = () => {
    // Header Toggle
    viewHeader.style.display = 'none';
    settingsHeader.style.display = 'none';
    orderEditHeader.style.display = 'flex';
    slideEditHeader.style.display = 'none';

    // Main Toggle
    listView.style.display = 'none';
    settings.style.display = 'none';
    slideEdit.style.display = 'none';
    orderEdit.style.display = 'flex';

    // Up/Down 버튼 초기 비활성화
    orderUpButton.disabled = true;
    orderDownButton.disabled = true;

    updateList(); // 순서 편집 목록을 데이터로 채웁니다.
    resetInactivityTimer();

    ['mousemove', 'keydown', 'click'].forEach(event => {
      orderEdit.addEventListener(event, resetInactivityTimer);
    });
  };

  // 날짜 포맷 변경 함수 (YYYY-MM-DD -> yy/mm/dd)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    const shortYear = year.slice(-2);
    return `${shortYear}/${month}/${day}`;
  };

  // View 섹션의 내용을 업데이트하는 함수
  const updateView = (dataArray) => {
    viewContainer.innerHTML = ''; // 기존 목록 초기화

    // order가 큰 순서대로 (최신순) 정렬
    const sortedData = dataArray.sort((a, b) => b.order - a.order);

    sortedData.forEach(data => {
      const { order, testMachine, model, purpose, startDate, endDate } = data;

      const scheduleText = (startDate || endDate)
        ? `${formatDate(startDate)}&nbsp;~&nbsp;${formatDate(endDate)}`
        : '-';

      const tableRow = document.createElement('ul');
      tableRow.className = 'table-content';
      tableRow.innerHTML = `
        <li><span>${testMachine || '-'}</span></li>
        <li><span>${model || '-'}</span></li>
        <li><span>${purpose || '-'}</span></li>
        <li><span>${scheduleText}</span></li>
      `;
      viewContainer.appendChild(tableRow);
    });
  };

  // List 섹션의 내용을 업데이트하는 함수
  const updateList = () => {
    listContainer.innerHTML = ''; // 기존 목록 초기화
    orderEditContainer.innerHTML = ''; // 순서 편집 목록 초기화

    const dataArray = storageManager.load();
    // order가 큰 순서대로 (최신순) 정렬
    const sortedData = dataArray.sort((a, b) => b.order - a.order);

    sortedData.forEach((data, index) => {
      const { order, testMachine, model, purpose, startDate, endDate } = data;

      const scheduleText = (startDate || endDate)
        ? `${formatDate(startDate)}&nbsp;&nbsp;~&nbsp;&nbsp;${formatDate(endDate)}`
        : '-';

      const tableRow = document.createElement('ul');
      tableRow.className = 'table-content';
      tableRow.dataset.order = order; // 데이터셋에 order 저장 (내부적으로 사용)
      tableRow.innerHTML = `
        <li><span>${order}</span></li>
        <li><span>${testMachine || '-'}</span></li>
        <li><span>${model || '-'}</span></li>
        <li><span>${purpose || '-'}</span></li>
        <li><span>${scheduleText}</span></li>
        <li>
          <button class="btn-delete" data-order="${order}">Delete</button>
          <button class="btn-modify" data-order="${order}">Edit</button>
        </li>
      `;
      listContainer.appendChild(tableRow);

      // order-edit-container를 위한 별도의 행 생성 (체크박스 포함)
      const orderEditTableRow = document.createElement('ul');
      orderEditTableRow.className = 'table-content';
      orderEditTableRow.dataset.order = order;
      const rowNumber = sortedData.length - index;
      orderEditTableRow.innerHTML = `
        <li><input type="checkbox" class="item-checkbox" value="${order}"></li>
        <li><span>${rowNumber}</span></li>
        <li><span>${testMachine || '-'}</span></li>
        <li><span>${model || '-'}</span></li>
        <li><span>${purpose || '-'}</span></li>
        <li><span>${scheduleText}</span></li>
      `;
      orderEditContainer.appendChild(orderEditTableRow);
    });
  };

  // 데이터 업데이트 및 저장 함수
  const applyDataChanges = (event) => {
    event.preventDefault(); // form의 기본 제출 동작(새로고침) 방지

    // 폼 유효성 검사
    if (!slideEdit.checkValidity()) {
      slideEdit.reportValidity(); // 유효성 검사 실패 시 브라우저 기본 메시지 표시
      return; // 유효성 검사 실패 시 함수 종료
    }

    if (confirm("작성하신 내용을 적용하시겠습니까?")) {
      // 1. 입력 값 가져오기
      const newTestMachine = testMachineInput.value.trim();
      const newModel = modelInput.value.trim();
      const newPurpose = purposeInput.value.trim();
      const newStartDate = startDateInput.value;
      const newEndDate = endDateInput.value;

      if (editingOrder) {
        // --- 데이터 수정 로직 ---
        const updatedData = { testMachine: newTestMachine, model: newModel, purpose: newPurpose, startDate: newStartDate, endDate: newEndDate };
        storageManager.updateData(editingOrder, updatedData);
        loadData();
        showList();
      } else {
        // --- 새 데이터 추가 로직 ---
        const newData = {
          order: 0, // order는 storageManager에서 할당
          testMachine: newTestMachine,
          model: newModel,
          purpose: newPurpose,
          startDate: newStartDate,
          endDate: newEndDate,
        };
        const isSuccess = storageManager.addData(newData);
        if (isSuccess) {
          loadData();
        }
        showList();
      }
    }
  };

  // 페이지 로드 시 localStorage에서 데이터 불러오기
  const loadData = () => {
    const dataArray = storageManager.load();
    updateView(dataArray);
  };

  const handleOrderEditCheckboxChange = (event) => {
    if (event.target.matches('.item-checkbox')) {
      const clickedCheckbox = event.target;
      const allCheckboxes = orderEditContainer.querySelectorAll('.item-checkbox');
      const allTableRows = orderEditContainer.querySelectorAll('.table-content');

      allTableRows.forEach(row => {
        row.classList.remove('selected');
      });

      if (clickedCheckbox.checked) {
        const parentRow = clickedCheckbox.closest('.table-content');

        allCheckboxes.forEach(checkbox => {
          if (checkbox !== clickedCheckbox) {
            checkbox.checked = false;
          }
        });

        if (parentRow) {
          parentRow.classList.add('selected');
        }

      }

      // 체크박스 상태에 따라 Up/Down 버튼 활성화/비활성화
      const selectedRow = orderEditContainer.querySelector('.table-content.selected');
      if (selectedRow) {
        updateOrderButtonsState(selectedRow);
      } else {
        updateOrderButtonsState(null);
      }
    }
  };

  // List의 수정/삭제 버튼 처리를 위한 이벤트 핸들러
  const handleListAction = (event) => {
    const target = event.target;

    // 삭제 버튼 클릭 시
    if (target.matches('.btn-delete')) {
      if (confirm("선택하신 항목을 삭제하시겠습니까?")) {
        const order = target.dataset.order;
        storageManager.deleteData(order);
        loadData(); // view-section 데이터 갱신
        updateList(); // list-section 목록 갱신
      }
    }

    // 수정 버튼 클릭 시
    if (target.matches('.btn-modify')) {
      const order = target.dataset.order;
      const dataArray = storageManager.load();
      const dataToEdit = dataArray.find(d => d.order == order);

      if (dataToEdit) {
        editingOrder = order; // 수정 모드로 설정
        // 폼에 데이터 채우기 및 화면 전환
        testMachineInput.value = dataToEdit.testMachine || '';
        modelInput.value = dataToEdit.model || '';
        purposeInput.value = dataToEdit.purpose || '';
        startDateInput.value = dataToEdit.startDate || '';
        endDateInput.value = dataToEdit.endDate || '';
        showCreateForm();
      }
    }
  };

  // Up/Down 버튼의 활성화/비활성화 상태를 업데이트하는 함수
  const updateOrderButtonsState = (selectedRow) => {
    if (!selectedRow) {
      orderUpButton.disabled = true;
      orderDownButton.disabled = true;
      return;
    }
    // 첫 번째 자식이면 Up 버튼 비활성화, 아니면 활성화
    orderUpButton.disabled = !selectedRow.previousElementSibling;
    // 마지막 자식이면 Down 버튼 비활성화, 아니면 활성화
    orderDownButton.disabled = !selectedRow.nextElementSibling;
  };

  // order-edit 테이블의 'New Order' 열 번호를 다시 매기는 함수
  const updateOrderEditNumbers = () => {
    const allRows = orderEditContainer.querySelectorAll('.table-content');
    const totalRows = allRows.length;
    allRows.forEach((row, index) => {
      const newOrderCell = row.querySelector('li:nth-child(2) span');
      if (newOrderCell) {
        newOrderCell.textContent = totalRows - index;
      }
    });
  };

  // 이벤트 리스너 연결
  listButton.addEventListener('click', showList);
  backToViewButtons.forEach(button => {
    button.addEventListener('click', showView);
  });
  backToListButton.addEventListener('click', showList); // order-edit-header의 back 버튼
  backfromSlideButton.addEventListener('click', showList);
  createButton.addEventListener('click', () => {
    
    editingOrder = null; // 'Create' 버튼 클릭 시에만 수정 모드 해제

    // form 안의 모든 input 내용 초기화
    const formElements = slideEdit.querySelectorAll('input, textarea');
    formElements.forEach(element => {
      if (element.type === 'date') {
        element.value = '';
      } else {
        element.value = '';
      }
    });

    showCreateForm();
  });
  applySlideButton.addEventListener('click', applyDataChanges);
  orderButton.addEventListener('click', showOrderEdit);
  
  listContainer.addEventListener('click', handleListAction);
  orderEditContainer.addEventListener('click', handleOrderEditCheckboxChange);

  orderUpButton.addEventListener('click', () => {
    const selectedRow = orderEditContainer.querySelector('.table-content.selected');
    if (selectedRow && selectedRow.previousElementSibling) {
      // DOM에서 요소의 위치를 위로 이동
      orderEditContainer.insertBefore(selectedRow, selectedRow.previousElementSibling);
      updateOrderButtonsState(selectedRow);
      updateOrderEditNumbers(); // 순서 변경 후 번호 다시 매기기
    }
  });

  orderDownButton.addEventListener('click', () => {
    const selectedRow = orderEditContainer.querySelector('.table-content.selected');
    if (selectedRow && selectedRow.nextElementSibling) {
      // DOM에서 요소의 위치를 아래로 이동
      orderEditContainer.insertBefore(selectedRow.nextElementSibling, selectedRow);
      updateOrderButtonsState(selectedRow);
      updateOrderEditNumbers(); // 순서 변경 후 번호 다시 매기기
    }
  });

  applyOrderButton.addEventListener('click', () => {
    if (confirm("변경된 순서를 적용하시겠습니까?")) {
      // 현재 DOM 순서대로 data-order 값을 배열로 만듦
      const orderedIds = Array.from(orderEditContainer.querySelectorAll('.table-content'))
                              .map(row => row.dataset.order);
      
      // storageManager를 통해 순서 저장
      storageManager.saveOrder(orderedIds);

      // 화면 갱신
      loadData(); // view-section 갱신
      updateList(); // 현재 order-edit-section 갱신
      // Up/Down 버튼 비활성화
      orderUpButton.disabled = true;
      orderDownButton.disabled = true;
    }
  });

  // 페이지가 처음 로드될 때 저장된 데이터를 불러옴
  loadData(); // list-view 갱신

  // 초기 상태 설정
  viewHeader.style.display = 'flex';
  settingsHeader.style.display = 'none';
  orderEditHeader.style.display = 'none';
  slideEditHeader.style.display = 'none';

  listView.style.display = 'flex';
  orderEdit.style.display = 'none';
  settings.style.display = 'none';
  slideEdit.style.display = 'none';
});
