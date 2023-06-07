export default function CartItem({ cartItemId }) {
  return (
    <>
      <div className="flex">
        <h2>Products</h2>
        <h2>Quantity</h2>
        <h2>Price</h2>
      </div>
      <div>
        <div>{cartItemId.title}</div>
        <div>{cartItemId.price}</div>
        <div>{cartItemId.description}</div>
      </div>
    </>
  );
}
