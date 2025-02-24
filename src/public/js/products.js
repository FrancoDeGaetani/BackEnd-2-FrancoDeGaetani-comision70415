

document.addEventListener("DOMContentLoaded", () => {
    let cartId = localStorage.getItem("cartId");

    if (!cartId) {
        fetch("/api/carts", { method: "POST" })
            .then(response => response.json())
            .then(data => {
                cartId = data.cart._id;
                localStorage.setItem("cartId", cartId);
            })
            .catch(error => console.error("Error al crear el carrito:", error));
    }

    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", async () => {
            const productId = button.getAttribute("data-product-id");

            if (!cartId) {
                console.error("No se pudo obtener el carrito.");
                return;
            }

            try {
                const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                });

            } catch (error) {
                console.error("Error en la solicitud:", error);
            }
        });
    });
});