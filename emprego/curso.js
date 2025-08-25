document.addEventListener('DOMContentLoaded', function() {

    // --- Referências dos Elementos do DOM ---
    const filterSidebar = document.querySelector('.curso-sidebar');
    const filterTagsContainer = document.querySelector('.filter-tags');
    const resetButton = document.querySelector('.reset-filters');
    const applyButton = document.querySelector('.filter-actions .button-primary');
    const searchInput = document.querySelector('.toolbar-search input');
    const courseCards = document.querySelectorAll('.curso-list .curso-list-card');
    const resultsHeading = document.querySelector('.curso-stats-bar .results-heading');
    const toggleFilterBtn = document.querySelector('.toggle-filter-btn');
    const body = document.body;

    // --- Funções de Lógica ---

    /**
     * Lê todos os inputs da barra de filtros e retorna um objeto com os valores selecionados.
     */
    function getSelectedFilters() {
        const filters = {
            categorias: [],
            cidades: [],
            search: searchInput.value.trim().toLowerCase()
        };

        filterSidebar.querySelectorAll('input:checked').forEach(input => {
            const labelText = input.labels[0].textContent.trim();
            const parentSummary = input.closest('details')?.querySelector('summary span')?.textContent.trim();

            switch (parentSummary) {
                case 'Categorias':
                    filters.categorias.push(labelText);
                    break;
                case 'Cidades':
                    filters.cidades.push(labelText);
                    break;
            }
        });

        return filters;
    }

    /**
     * Atualiza as tags visíveis de "Filtros Aplicados" com base nos filtros selecionados.
     */
    function updateAppliedTags() {
        filterTagsContainer.innerHTML = '';
        const filters = getSelectedFilters();

        const allFilters = [
            ...filters.categorias,
            ...filters.cidades,
        ].filter(Boolean);

        if (filters.search) {
             allFilters.push(`Busca: "${filters.search}"`);
        }

        allFilters.forEach(filterText => {
            const tag = document.createElement('span');
            tag.classList.add('filter-tag');
            tag.innerHTML = `${filterText} <i class="fas fa-times"></i>`;
            tag.addEventListener('click', () => removeFilterTag(tag, filterText));
            filterTagsContainer.appendChild(tag);
        });

        applyFilters(filters);

        // Fecha a barra de filtro no celular após aplicar
        if (window.innerWidth <= 992) {
            closeFilterSidebar();
        }
    }

    /**
     * Remove uma tag de filtro e desmarca o input correspondente.
     */
    function removeFilterTag(tagElement, filterText) {
        const allInputs = filterSidebar.querySelectorAll('input');
        allInputs.forEach(input => {
            const labelText = input.labels[0]?.textContent.trim();
            if (labelText === filterText) {
                input.checked = false;
            }
        });

        if (filterText.startsWith('Busca:')) {
            searchInput.value = '';
        }

        tagElement.remove();
        applyFilters(getSelectedFilters());
    }

    /**
     * Função principal de filtragem: percorre todos os cards de curso e os exibe ou oculta.
     */
    function applyFilters(filters) {
        let visibleCoursesCount = 0;

        courseCards.forEach(card => {
            let isVisible = true;
            const cardData = {
                title: card.querySelector('.curso-title')?.textContent.trim().toLowerCase() || '',
                categoria: card.dataset.categoria || '',
                cidade: card.dataset.cidade || ''
            };

            // Lógica para busca por texto
            if (filters.search && !cardData.title.includes(filters.search)) {
                isVisible = false;
            }

            // Lógica para filtro de categoria
            if (filters.categorias.length > 0 && !filters.categorias.includes('Todas as categorias') && !filters.categorias.includes(cardData.categoria)) {
                isVisible = false;
            }
            
            // Lógica para filtro de cidade
            if (filters.cidades.length > 0 && !filters.cidades.includes(cardData.cidade)) {
                isVisible = false;
            }

            // Atualiza a visibilidade do card e a contagem
            if (isVisible) {
                card.style.display = 'flex';
                visibleCoursesCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Atualiza o texto que exibe o número de resultados
        resultsHeading.textContent = `Mostrando ${visibleCoursesCount.toLocaleString()} cursos`;
        if (visibleCoursesCount === 0) {
            resultsHeading.textContent = 'Nenhum curso encontrado.';
        }
    }

    // --- Funções para o Sidebar Mobile ---
    function openFilterSidebar() {
        filterSidebar.classList.add('active');
        body.classList.add('no-scroll');
    }

    function closeFilterSidebar() {
        filterSidebar.classList.remove('active');
        body.classList.remove('no-scroll');
    }

    // --- Event Listeners (Onde a mágica acontece) ---

    // Botão "Aplicar filtros"
    applyButton.addEventListener('click', function(event) {
        event.preventDefault();
        updateAppliedTags();
    });

    // Botão "Redefinir filtros"
    if (resetButton) {
        resetButton.addEventListener('click', function(event) {
            event.preventDefault();
            filterSidebar.querySelectorAll('input').forEach(input => input.checked = false);
            searchInput.value = '';
            filterTagsContainer.innerHTML = '';
            applyFilters({});
        });
    }

    // Busca ao pressionar "Enter"
    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            updateAppliedTags();
        }
    });

    // Botão para abrir o sidebar no mobile
    if (toggleFilterBtn) {
        toggleFilterBtn.addEventListener('click', openFilterSidebar);
    }
    
    // Fecha o sidebar se o usuário clicar fora dele
    window.addEventListener('click', function(event) {
        if (filterSidebar.classList.contains('active') && !filterSidebar.contains(event.target) && !toggleFilterBtn.contains(event.target)) {
            closeFilterSidebar();
        }
    });

    // Executa a filtragem inicial ao carregar a página
    applyFilters(getSelectedFilters());

});