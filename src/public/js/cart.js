document.addEventListener("DOMContentLoaded", () => {
    const cartId = window.location.pathname.split("/").pop(); 

    document.querySelectorAll(".remove-from-cart").forEach(button => {
        button.addEventListener("click", async () => {
            const productId = button.getAttribute("data-product-id");

            try {
                const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                    method: "DELETE",
                });
                
            } catch (error) {
                console.error("Error en la solicitud:", error);
            }
        });
    });

    const clearCartButton = document.getElementById("clear-cart");
    if (clearCartButton) {
        clearCartButton.addEventListener("click", async () => {
            try {
                const response = await fetch(`/api/carts/${cartId}`, {
                    method: "DELETE",
                });

            } catch (error) {
                console.error("Error en la solicitud:", error);
            }
        });
    }
});