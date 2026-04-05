
-- Drop existing insert policies
DROP POLICY IF EXISTS "Authenticated users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can create order items" ON public.order_items;

-- Allow anyone (including anonymous/guest) to insert orders
CREATE POLICY "Anyone can create orders"
ON public.orders
FOR INSERT
WITH CHECK (true);

-- Allow anyone to insert order items
CREATE POLICY "Anyone can create order items"
ON public.order_items
FOR INSERT
WITH CHECK (true);
