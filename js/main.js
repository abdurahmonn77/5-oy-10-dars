const TOKEN = "7265655861:AAHrbRSsvinZdqlCSR3EToyeZPEP5S_5G_Y";
const CHAT_ID = "-1002345963445";
const HTTP = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

document.addEventListener("DOMContentLoaded", () => {
    const elProductList = document.querySelector(".product-list");

    async function getProducts(API) {
        try {
            const response = await axios.get(API);
            return response.data.products;
        } catch (error) {
            console.error("Error fetching products:", error.message);
            return []; 
        }
    }

    async function renderProducts() {
        const products = await getProducts("https://dummyjson.com/products");

        if (products.length === 0) {
            elProductList.innerHTML = "<p>Failed to load products. Please try again later.</p>";
            return;
        }

        products.forEach((item) => {
            const elItem = document.createElement("li");
            elItem.className = "w-[300px] bg-white pb-2 overflow-hidden rounded-[20px]";
            elItem.innerHTML = `
                <img class="h-[300px] object-contain" src="${item.images[0]}" alt="Product Image" width="300px" height="300px">
                <div class="px-2 mt-[20px]">
                    <strong class="text-[22px] font-bold text-red-500 line-clamp-1">${item.title}</strong>
                    <p class="text-[16px] text-slate-500 line-clamp-3 mt-[10px]">${item.description}</p>
                    <strong class="text-[23px] mt-2 text-green-700">$${item.price}</strong>
                    <button class="buy-btn mt-3 text-[18px] w-full bg-red-500 border-[1px] border-transparent hover:border-red-500 hover:bg-transparent duration-[0.3s] hover:text-red-500 text-white py-1 rounded-full hover:scale-[1.05]" data-id="${item.id}">
                        Buy Product
                    </button>
                </div>
            `;

            elProductList.appendChild(elItem);
        });

        const buyButtons = document.querySelectorAll(".buy-btn");
        buyButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                const productId = e.target.getAttribute("data-id");
                handleBuyBtn(productId);
            });
        });
    }

    renderProducts();
});

async function handleBuyBtn(id) {
    try {
        const response = await axios.get(`https://dummyjson.com/products/${id}`);
        const product = response.data;

        const message = `<b>Site Info</b>\n` +
                        `<b>Title:</b> ${product.title}\n` +
                        `<b>Description:</b> ${product.description}\n`;

        const body = {
            chat_id: CHAT_ID,
            parse_mode: "html",
            text: message
        };

        const headers = {
            "Content-Type": "application/json"
        };

        const result = await axios.post(HTTP, body, { headers });
        console.log("Message sent successfully:", result.data);
    } catch (error) {
        console.error("Error sending message:", error.response?.data || error.message);
    }
}
