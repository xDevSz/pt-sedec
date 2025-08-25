document.addEventListener('DOMContentLoaded', function() {

    // --- Referências dos Elementos do DOM ---
    const filterSidebar = document.querySelector('.vagas-sidebar');
    const filterTagsContainer = document.querySelector('.filter-tags');
    const resetButton = document.querySelector('.reset-filters');
    const applyButton = document.querySelector('.filter-actions .button-primary');
    const searchInput = document.querySelector('.toolbar-search input');
    const jobCards = document.querySelectorAll('.vagas-list .job-list-card');
    const totalJobsCount = document.querySelector('.vagas-stats-bar .stat-number');
    const resultsHeading = document.querySelector('.results-heading');
    const toggleFilterBtn = document.querySelector('.toggle-filter-btn');
    const body = document.body;

    // --- Funções de Lógica ---

    /**
     * Lê todos os inputs da barra de filtros e retorna um objeto com os valores selecionados.
     */
    function getSelectedFilters() {
        const filters = {
            order: filterSidebar.querySelector('input[name="order"]:checked')?.labels[0].textContent.trim() || '',
            cities: [],
            experiences: [],
            show: [],
            jobTypes: [],
            salaries: [],
            salaryTypes: [],
            educations: [],
            locations: [],
            search: searchInput.value.trim().toLowerCase()
        };

        filterSidebar.querySelectorAll('input:checked').forEach(input => {
            const labelText = input.labels[0].textContent.trim();
            const parentSummary = input.closest('details')?.querySelector('summary span')?.textContent.trim();

            switch (parentSummary) {
                case 'Cidade':
                    filters.cities.push(labelText);
                    break;
                case 'Requerimento da vaga':
                    filters.experiences.push(labelText);
                    break;
                case 'Mostrar vagas':
                    filters.show.push(labelText);
                    break;
                case 'Tipo de vaga':
                    filters.jobTypes.push(labelText);
                    break;
                case 'Salário a partir de':
                    filters.salaries.push(labelText);
                    break;
                case 'Tipo de salário':
                    filters.salaryTypes.push(labelText);
                    break;
                case 'Escolaridade':
                    filters.educations.push(labelText);
                    break;
                case 'Local da vaga':
                    filters.locations.push(labelText);
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
            ...filters.cities,
            ...filters.experiences,
            ...filters.show,
            ...filters.jobTypes,
            ...filters.salaries,
            ...filters.salaryTypes,
            ...filters.educations,
            ...filters.locations,
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
     * Função principal de filtragem: percorre todos os cards de vaga e os exibe ou oculta.
     */
    function applyFilters(filters) {
        let visibleJobsCount = 0;

        jobCards.forEach(card => {
            let isVisible = true;
            const cardData = {
                title: card.querySelector('.job-title')?.textContent.trim().toLowerCase() || '',
                location: card.querySelector('.job-location')?.textContent.trim().toLowerCase() || '',
                jobType: card.querySelector('.job-details-list li:nth-child(2)')?.textContent.trim().toLowerCase() || '',
                salary: card.querySelector('.job-details-list li:nth-child(1)')?.textContent.trim().toLowerCase() || '',
                // Dados dos data-attributes para uma filtragem mais precisa
                city: card.dataset.cidade || '',
                experience: card.dataset.experiencia || '',
                pcd: card.dataset.pcd === 'true',
                salaryType: card.dataset.salarioTipo || '',
                education: card.dataset.escolaridade || '',
                local: card.dataset.local || ''
            };

            // Lógica para busca por texto
            if (filters.search && !cardData.title.includes(filters.search) && !cardData.location.includes(filters.search)) {
                isVisible = false;
            }

            // Lógica para filtro de tipo de vaga
            if (filters.jobTypes.length > 0 && !filters.jobTypes.some(type => cardData.jobType.includes(type.toLowerCase()))) {
                isVisible = false;
            }
            
            // Lógica para filtro de PcD
            if (filters.show.includes('Para PcD') && !cardData.pcd) {
                isVisible = false;
            }

            // Lógica para filtro de experiência
            if (filters.experiences.length > 0 && !filters.experiences.includes('Todas') && !filters.experiences.includes(cardData.experience)) {
                isVisible = false;
            }
            
            // Lógica para filtro de tipo de salário
            if (filters.salaryTypes.length > 0 && !filters.salaryTypes.includes(cardData.salaryType)) {
                isVisible = false;
            }

            // Lógica para filtro de salário
            if (filters.salaries.length > 0) {
                const cardSalary = parseFloat(cardData.salary.replace(/[^\d,]/g, '').replace(',', '.'));
                const filterSalary = parseFloat(filters.salaries[0].replace(/[^\d,]/g, '').replace(',', '.'));
                if (isNaN(cardSalary) || cardSalary < filterSalary) {
                    isVisible = false;
                }
            }

            // Atualiza a visibilidade do card e a contagem
            if (isVisible) {
                card.style.display = 'flex';
                visibleJobsCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Atualiza o texto que exibe o número de resultados
        totalJobsCount.textContent = visibleJobsCount.toLocaleString();
        resultsHeading.textContent = `Mostrando ${visibleJobsCount.toLocaleString()} vagas`;
        if (visibleJobsCount === 0) {
            resultsHeading.textContent = 'Nenhuma vaga encontrada.';
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