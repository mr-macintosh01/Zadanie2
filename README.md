# Zadanie2

## Zadanie Obowiązkowe
### 1. Opis wybranej aplikacji i stosu technologicznego

Zaimplementowane rozwiązanie to natywna aplikacja chmurowa (cloud-native) zbudowana w oparciu o MERN Stack (MongoDB, Express.js, React, Node.js). Architektura została zaprojektowana jako zestaw odseparowanych mikroserwisów, co pozwala na demonstrację kluczowych koncepcji Kubernetes, takich jak: service discovery (wykrywanie usług), zarządzanie danymi stanowymi (stateful data) oraz routing ruchu za pomocą Ingress.

Składniki wybranego stosu (Stack):

Frontend (React): Aplikacja kliencka typu SPA (Single Page Application) serwowana przez serwer Nginx. Pełni rolę warstwy prezentacji, dynamicznie pobierając dane z API backendu.

Backend (Node.js/Express): REST API obsługujące logikę biznesową i utrzymujące trwałe połączenie z bazą danych. Udostępnia dedykowane punkty końcowe (/health) wykorzystywane przez sondy Kubernetes (Probes).

Baza Danych (MongoDB): Dokumentowa baza danych. Została wdrożona jako StatefulSet, aby zapewnić trwałość danych oraz stabilną tożsamość sieciową.

Klaster wykorzystuje Ingress Controller do kierowania zewnętrznego ruchu HTTP z adresu http://brilliantapp.zad do odpowiednich serwisów wewnętrznych w oparciu o ścieżki URL.

### 2. Opis konfiguracji wdrożenia

Wdrożenie składa się z następujących zasobów Kubernetes:

ConfigMaps i Secrets
StatefulSet (MongoDB)
Deployments (Frontend i Backend)

Backend Deployment zawiera definicję Sond Żywotności i Gotowości (Liveness & Readiness Probes) (element zadania dodatkowego), co zapewnia kierowanie ruchu tylko do zdrowych podów oraz automatyczny restart awaryjny kontenerów.

Services:
Ingress:

### 3. Ilustracja uruchomienia (Miejsca na zrzuty ekranu)

Status Klastra: 
<img width="1903" height="559" alt="image" src="https://github.com/user-attachments/assets/122e8791-b27a-4950-bbe2-3ded3c0383a7" />

Adres Ingress:
<img width="1918" height="78" alt="image" src="https://github.com/user-attachments/assets/4db63878-f0b9-49e9-bc8f-8cd9a82455ab" />

Weryfikacja Przeglądarki (Frontend): Zrzut ekranu strony http://brilliantapp.zad wyświetlającej aplikację React.
<img width="1920" height="1039" alt="image" src="https://github.com/user-attachments/assets/0082e5e7-43e0-44a6-84c7-9be20bb03714" />

Weryfikacja Przeglądarki (Backend API):
<img width="1920" height="1032" alt="image" src="https://github.com/user-attachments/assets/0fbcd258-196d-4ba4-9441-f9263cd57927" />

## Część Nieobowiązkowa

### 1. Opis zmian i procesu aktualizacji
Celem zadania było przeprowadzenie aktualizacji aplikacji backendowej z wersji v1 na v2 bez przerywania jej dostępności (Zero Downtime Deployment).

Wprowadzone zmiany:
Zmodyfikowano kod źródłowy backendu, zmieniając zwracany komunikat JSON z "Hello from Backend v1!" na "Hello from Backend v2!".

Zbudowano nowy obraz Docker oznaczony tagiem :v2.

Strategia aktualizacji: Kubernetes domyślnie wykorzystuje strategię RollingUpdate. Kubernetes uruchomił nowy Pod z wersją v2. Dzięki skonfigurowanej sondzie gotowości (Readiness Probe), klaster oczekiwał, aż nowa aplikacja nawiąże połączenie z bazą danych i zgłosi status "200 OK". Dopiero po potwierdzeniu gotowości nowego Poda, ruch sieciowy został do niego przekierowany, a stary Pod (wersja v1) został bezpiecznie wyłączony (Terminated).

### 2. Ilustracja procesu

<img width="1910" height="701" alt="image" src="https://github.com/user-attachments/assets/76201aa9-f4f3-4ae8-87de-14f17180a1c3" />

Powyższy zrzut ekranu przedstawia proces aktualizacji w czasie rzeczywistym. Widać płynne przejście odpowiedzi serwera z wersji v1 na v2. Brak błędów połączenia (connection refused/timeout) potwierdza zachowanie ciągłości działania usługi.

## Dodatkowe 20% punktów - opis

### Uzasadnienie doboru sond (Probes)

W konfiguracji Deploymentu backendu (3-backend.yaml) zastosowano dwa rodzaje sond, aby zwiększyć niezawodność aplikacji:

#### Readiness Probe (Sonda Gotowości):

Typ: httpGet na ścieżkę /health.

Cel: Aplikacja backendowa wymaga czasu na nawiązanie połączenia z bazą MongoDB. Sonda ta zapobiega kierowaniu ruchu użytkowników do kontenera, który "wstał", ale nie jest jeszcze połączony z bazą danych. Ruch trafia do Poda dopiero, gdy endpoint /health zwróci kod 200.

#### Liveness Probe (Sonda Żywotności):

Typ: httpGet na ścieżkę /health.

Cel: Monitoruje, czy proces Node.js nie uległ zawieszeniu (deadlock). Jeśli aplikacja przestanie odpowiadać na zapytania przez dłuższy czas (np. z powodu wycieku pamięci), Kubernetes automatycznie zrestartuje kontener, przywracając funkcjonalność bez ingerencji administratora.
