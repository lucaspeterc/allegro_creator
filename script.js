import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';

import { 
    projectTypes, 
    technology, 
    visualStyles, 
    optionalAddOns, 
    deliveryTimes, 
    defaultFeatures,
    faqList,
    generateTitleHeader
} from './data.js';

function generateAuctionNames() {
    const auctionData = [];
    let idCounter = 1;

    for (const project of projectTypes) {
        for (const style of visualStyles) {
            for (let addOnCount = 0; addOnCount <= optionalAddOns.length; addOnCount++) {
                const addOnCombinations = getCombinations(optionalAddOns, addOnCount);

                for (const addOns of addOnCombinations) {
                    for (const delivery of deliveryTimes) {
                        const price = calculatePrice(project.basePrice, addOns, delivery);
                        const titleHeader = generateTitleHeader(project, technology);
                        const studioInfo = generateBaseDescription(
                            project,
                            technology,
                            style,
                            addOns,
                            delivery,
                            price
                        ).studioInfo;
                        const description = generateDescription(project, technology, style, addOns, delivery, price);
                        const htmlDescription = generateHTMLDescription(
                            project,
                            technology,
                            style,
                            addOns,
                            delivery,
                            price,
                            studioInfo,
                            titleHeader
                        );
                        const addOnNames = addOns.map(a => a.short).join(', ');
                        const baseName = `${project.name} - [${technology.name}] ${style.name} (${delivery.time}) ${addOnNames || ""}`.trim();
                        const auctionName = baseName.length > 75 ? `${baseName.slice(0, 72)}...` : baseName;

                        auctionData.push({
                            id: `custom-product-${idCounter++}`,
                            name: auctionName,
                            project: project.name,
                            technology: technology.name,
                            style: style.name,
                            addOns: addOnNames || "Brak",
                            time: delivery.time,
                            price,
                            description,
                            htmlDescription
                        });
                    }
                }
            }
        }
    }
    return auctionData;
}

export function calculatePrice(basePrice, addOns, deliveryTime) {
    const addOnPrice = addOns.reduce((sum, addOn) => sum + addOn.price, 0);
    return basePrice + addOnPrice + deliveryTime.priceModifier;
}


// 1. Helper function to generate combinations of add-ons
export function getCombinations(array, length) {
    if (length === 0) return [[]];
    if (array.length === 0) return [];
    const [head, ...tail] = array;
    const withHead = getCombinations(tail, length - 1).map(combination => [head, ...combination]);
    const withoutHead = getCombinations(tail, length);
    return [...withHead, ...withoutHead];
}

function generateBaseDescription(project, technology, style, addOns, deliveryTime, titleHeader) {
    const addOnDescriptions = addOns.map(a => a.description).join(', ') || "Brak dodatkowych funkcji";

    const points = `
        Zamawiając produkty cyfrowe w naszym studiu zawsze otrzymujesz gotowy, kompleksowy i skalowany produkt zawierający:
        - ${project.description}
        - Podstawowy pakiet wszystkich realizacji obejmuje między innymi: ${defaultFeatures}
        - Najlepsza dostępna technologia. ${technology.description}
        - Wybrany styl wizualny: ${style.description}
        - ${addOnDescriptions}
        - Czas realizacji: ${deliveryTime.description}
    `.trim();

    const studioInfo = `

        Varsa Codes to nowoczesne studio programistyczne, specjalizujące się w tworzeniu skalowalnych i intuicyjnych stron internetowych oraz aplikacji webowych. Nasz zespół ekspertów kładzie nacisk na dopasowanie rozwiązań technologicznych do indywidualnych potrzeb klientów. Wykorzystujemy nowoczesne biblioteki JavaScript, takie jak React i Next.js, dostarczając produkty na najwyższym poziomie.
        <br></br>
        Dzięki innowacyjnemu podejściu i zaawansowanym technologiom wspieramy rozwój biznesów naszych klientów, tworząc rozwiązania cyfrowe, które zwiększają ich wzrost, efektywność i widoczność w dynamicznym środowisku online. 
        <br></br>
        Nasza oferta obejmuje nie tylko tworzenie stron internetowych, aplikacji i platform e-commerce, ale także eksperckie wsparcie w zakresie reklamy internetowej (Google Ads, kampanie digital) oraz rozwiązań z zakresu cyberbezpieczeństwa. Integrujemy również technologie AI i uczenia maszynowego, które zwiększają funkcjonalność i wartość dostarczanych produktów.

    `.trim();

    // Contact Information
    const contactInfo = `
        Skontaktuj się z nami w przypadku pytań: 
        - E-mail: hello@varsa.codes
        - Więcej informacji i pełna oferta: https://www.varsa.codes/

    `.trim();


    return { points, studioInfo, contactInfo }; // Fixed return structure

}
// Updated generateDescription using shared content
export function generateDescription(project, technology, style, addOns, deliveryTime, price) {
    const { points, studioInfo, contactInfo } = generateBaseDescription(project, technology, style, addOns, deliveryTime, price);
    return `${points}\n\n${studioInfo}\n\n${contactInfo}`;
}

// Updated generateHTMLDescription using shared content
function generateHTMLDescription(project, technology, style, addOns, deliveryTime, price, studioInfo, titleHeader, addOnDescriptions) {
const { points, contactInfo } = generateBaseDescription(project, technology, style, addOns, deliveryTime, price); // Reuse shared data

const faqHtml = faqList
        .map(
            (faq) => `
                <li>
                    <strong>${faq.question}</strong>
                    <p>${faq.answer}</p>
                </li>
            `
        )
        .join("");

    return `
        <!DOCTYPE html>
        <html lang="pl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${project.name} - Oferta</title>
           <style>
    body {
        font-family: 'Courier New', monospace; /* Bold, raw font choice */
        margin: 20px;
        background: #f4f4f4; /* Light grey background */
        color: #111; /* Darker, high-contrast text color */
    }
    .container {
        max-width: 800px;
        margin: 0 auto;
        border: 4px solid #111; /* Thick, unapologetic border */
        border-radius: 0; /* Brutalist designs avoid rounded edges */
        overflow: hidden;
        box-shadow: none; /* Remove soft shadows */
        background: #fff; /* Use solid white for container background */
    }
    .header {
        background: #ff5722; /* Bright, bold color for emphasis */
        color: #fff;
        padding: 20px; /* Slightly larger padding for bold impact */
        text-align: left; /* Shift to raw, uneven alignment */
        border-bottom: 4px solid #111; /* Strong separation line */
    }
    .header h1 {
        margin: 0;
        font-size: 2.5rem; /* Bold, large headline */
        text-transform: uppercase; /* Raw, bold typography */
    }
    .content {
        padding: 30px;
        font-size: 1.1rem; /* Slightly larger font for readability */
        background: #f4f4f4; /* Consistent light-grey background */
        color: #111; /* High-contrast text */
        border-top: 4px solid #111; /* Bold section divider */
    }
    .features {
        margin: 20px 0;
        padding: 20px;
        background: #fffb00; /* Bright yellow for emphasis */
        border-left: 10px solid #111; /* Bold border */
        font-weight: bold; /* Strong emphasis on text */
    }
    .footer {
        background: #111; /* Dark, strong contrast footer */
        text-align: center;
        padding: 20px;
        font-size: 14px;
        color: #fff; /* White text for contrast */
        border-top: 4px solid #ff5722; /* Connect footer to header visually */
    }
</style>

        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>${project.name}</h1>
                </div>
                <div class="content">
                    <h2>Opis Produktu</h2>
                    <p>${titleHeader}</p>
                    <br></br>
                    <p><strong>${project.description}</strong></p>
                    <br></br>
                    <h2>Wybierając naszą ofertę otrzymasz:</h2>
                    <ul>
                        <li>${technology.description}</li>
                        <li>Styl wizualny: ${style.description}</li>
                        <li>Funkcje domyślne: ${defaultFeatures}</li>
                        <li>Dodatki: ${addOnDescriptions}</li>
                        <li>Czas realizacji: ${deliveryTime.description}</li>
                        <li>Cena:<strong> ${price} PLN</strong></li>
                    </ul>

                    <h2>Proces realiazacji po zakupie</h2>

                    <ul>
                        <li>1. Skontaktujemy się z Tobą, aby omówić szczegóły projektu.</li>
                        <li>2. Prześlemy Ci formularz i poprosimy o uzupełnienie danymi które będą potrzebne do stworzenia Twojego produktu.</li>
                        <li>3. Przystąpimy do pracy i będziemy na bieżąco informować Cię o postępach.</li>
                        <li>4. Otrzymasz demo produktu, na podstawie którego określisz swoje uwagi i poprawki.</li>
                        <li>5. Po zmianach, otrzymasz finalny produkt, gotowy do publikacji.</li>
                    </ul>

                    <h2>O Nas</h2>
                    <p> ${studioInfo} </p>
                    
                    <h2>Najczęściej zadawane pytania</h2>
                    <ol>
                        ${faqHtml} <!-- Injecting the FAQ HTML -->
                    </ol>
                    </div>
                <div class="footer">
                    &copy; ${new Date().getFullYear()} Varsa Codes. Wszystkie prawa zastrzeżone.
                </div>
            </div>
        </body>
        </html>
    `.trim();
}

// Generate the auction data
const auctionData = generateAuctionNames();



// Define the structure of the CSV file
const csvWriter = createCsvWriter({
    path: './allegro_oferty_with_descriptions.csv',
    header: [
        { id: 'id', title: 'ID Produktu' },
        { id: 'name', title: 'Nazwa Aukcji' },
        { id: 'project', title: 'Projekt' },
        { id: 'technology', title: 'Technologia' },
        { id: 'style', title: 'Styl wizualny' },
        { id: 'addOns', title: 'Dodatki' },
        { id: 'time', title: 'Czas realizacji' },
        { id: 'price', title: 'Cena' },
        { id: 'description', title: 'Opis aukcji' },
        { id: 'htmlDescription', title: 'Opis HTML' } // Ensure this matches the generated data
    ],
});

// Write the data to the CSV file
csvWriter
    .writeRecords(auctionData.slice(0, 10))
    .then(() => {
        console.log('Plik CSV został pomyślnie utworzony: allegro_oferty_with_descriptions.csv');
    })
    .catch((error) => {
        console.error('Błąd podczas tworzenia pliku CSV:', error);
    });