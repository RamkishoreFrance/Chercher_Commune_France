document.addEventListener("DOMContentLoaded", function() {
    const regionSelect = document.getElementById("region-select");
    const departmentSelect = document.getElementById("department-select");
    const showCitiesBtn = document.getElementById("show-cities-btn");
    const cityListDiv = document.getElementById("city-list");
    const geoBtn = document.getElementById("geo-btn");
    const geoInfoDiv = document.getElementById("geo-info");
    const exportBtn = document.getElementById("export-btn");
    let sortedCommunes = [];
    let currentSortColumn = null;
    let currentSortOrder = 'asc'; // Ordre initial pour le tri

    // 1. Récupérer la liste des régions
    fetch('https://geo.api.gouv.fr/regions')
        .then(response => response.json())
        .then(regions => {
            regions.forEach(region => {
                const option = document.createElement('option');
                option.value = region.code;
                option.textContent = region.nom;
                regionSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Erreur lors de la récupération des régions :', error));

    // 2. Récupérer les départements pour la région choisie
    regionSelect.addEventListener("change", function() {
        const regionCode = regionSelect.value;

        if (regionCode) {
            departmentSelect.disabled = false;
            departmentSelect.innerHTML = '<option value="">--Choisir un département--</option>';

            fetch(`https://geo.api.gouv.fr/regions/${regionCode}/departements`)
                .then(response => response.json())
                .then(departments => {
                    departments.forEach(department => {
                        const option = document.createElement('option');
                        option.value = department.code;
                        option.textContent = department.nom;
                        departmentSelect.appendChild(option);
                    });
                })
                .catch(error => console.error('Erreur lors de la récupération des départements :', error));
        } else {
            departmentSelect.disabled = true;
            departmentSelect.innerHTML = '<option value="">--Choisir un département--</option>';
        }

        showCitiesBtn.disabled = true;
    });

    // 3. Activer le bouton "Afficher les communes"
    departmentSelect.addEventListener("change", function() {
        showCitiesBtn.disabled = !departmentSelect.value;
    });

    // 4. Afficher les communes
    showCitiesBtn.addEventListener("click", function() {
        const departmentCode = departmentSelect.value;
        cityListDiv.innerHTML = '';

        if (departmentCode) {
            fetch(`https://geo.api.gouv.fr/departements/${departmentCode}/communes`)
                .then(response => response.json())
                .then(communes => {
                    sortedCommunes = communes.sort((a, b) => b.population - a.population);

                    if (sortedCommunes.length === 0) {
                        cityListDiv.innerHTML = "<p>Aucune commune trouvée pour ce département.</p>";
                        return;
                    }

                    // Créer le tableau
                    const table = document.createElement('table');
                    table.setAttribute('border', '1');
                    table.style.width = '100%';
                    table.innerHTML = `
                        <thead>
                            <tr>
                                <th class="sortable" data-column="nom">Nom de la commune</th>
                                <th class="sortable" data-column="population">Population</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    `;
                    cityListDiv.appendChild(table);

                    renderTable(sortedCommunes); // Afficher toutes les communes

                    // Activer le tri par colonne
                    document.querySelectorAll('.sortable').forEach(header => {
                        header.addEventListener('click', function() {
                            const column = this.getAttribute('data-column');
                            sortTable(column);
                        });
                    });

                    exportBtn.disabled = false;
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des communes :', error);
                    cityListDiv.innerHTML = "<p>Erreur lors de la récupération des communes.</p>";
                });
        }
    });

    // Fonction pour trier le tableau
    function sortTable(column) {
        if (currentSortColumn === column) {
            // Inverser l'ordre de tri si la même colonne est cliquée
            currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            // Si une nouvelle colonne est triée, commencer par croissant
            currentSortColumn = column;
            currentSortOrder = 'asc';
        }

        sortedCommunes.sort((a, b) => {
            if (column === 'nom') {
                return currentSortOrder === 'asc' ? a.nom.localeCompare(b.nom) : b.nom.localeCompare(a.nom);
            } else if (column === 'population') {
                return currentSortOrder === 'asc' ? a.population - b.population : b.population - a.population;
            }
        });

        renderTable(sortedCommunes); // Recharger toutes les communes triées
    }

    // Fonction pour afficher toutes les communes
    function renderTable(data) {
        const tbody = document.querySelector('#city-list table tbody');
        tbody.innerHTML = '';

        data.forEach(commune => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${commune.nom}</td>
                <td>${commune.population}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // Géolocalisation
    geoBtn.addEventListener("click", function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                fetch(`https://geo.api.gouv.fr/communes?lat=${lat}&lon=${lon}&fields=nom,population,surface,centre,contour`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.length > 0) {
                            const city = data[0];
                            geoInfoDiv.innerHTML = `
                                <h2>Ville : ${city.nom}</h2>
                                <p>Population : ${city.population}</p>
                                <p>Surface : ${city.surface} m²</p>
                            `;

                            // Mise à jour de la carte avec la ville géolocalisée
                            const map = L.map('map').setView([city.centre.coordinates[1], city.centre.coordinates[0]], 13);
                            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                                attribution: '&copy; OpenStreetMap contributors'
                            }).addTo(map);
                            L.marker([city.centre.coordinates[1], city.centre.coordinates[0]]).addTo(map)
                                .bindPopup(`${city.nom} - Population: ${city.population}`).openPopup();
                        } else {
                            geoInfoDiv.innerHTML = "<p>Aucune ville trouvée pour votre position.</p>";
                        }
                    })
                    .catch(error => {
                        console.error('Erreur lors de la récupération des informations de la ville :', error);
                        geoInfoDiv.innerHTML = "<p>Erreur lors de la récupération des informations de la ville.</p>";
                    });
            }, error => {
                console.error('Erreur de géolocalisation :', error);
                geoInfoDiv.innerHTML = "<p>Impossible de vous géolocaliser.</p>";
            });
        } else {
            geoInfoDiv.innerHTML = "<p>Votre navigateur ne supporte pas la géolocalisation.</p>";
        }
    });

    // Exporter les données du tableau en CSV
    exportBtn.addEventListener("click", function() {
        let csv = 'Nom de la commune,Population\n';
        sortedCommunes.forEach(commune => {
            csv += `${commune.nom},${commune.population}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'communes.csv';
        link.click();
    });

    // Scroll to Top and Bottom functionality
    document.getElementById('scroll-top').addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    document.getElementById('scroll-bottom').addEventListener('click', function() {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    });
});
