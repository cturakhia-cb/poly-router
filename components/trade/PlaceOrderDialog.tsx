"use client"

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Market } from "@/types/market";
import { PlaceOrderRequest, OrderType, OrderSide, Outcome } from "@/types/trade";
import { api } from "@/lib/clientFetch";

interface PlaceOrderDialogProps {
  market: Market;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PlaceOrderDialog({ market, open, onOpenChange }: PlaceOrderDialogProps) {
  const [orderType, setOrderType] = useState<OrderType>("market");
  const [outcome, setOutcome] = useState<Outcome>("yes");
  const [side, setSide] = useState<OrderSide>("buy");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const payload: PlaceOrderRequest = {
        marketId: market.id,
        outcome,
        side,
        size: parseFloat(size),
        orderType,
        ...(orderType === "limit" && { price: parseFloat(price) }),
      };

      await api("/api/trade/polymarket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setSuccess(true);
    } catch (err: any) {
      if (err.status === 501) {
        setError("Trading is not yet implemented. Wallet integration coming soon!");
      } else {
        setError(err.message || "Failed to place order");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSize("");
    setPrice("");
    setError(null);
    setSuccess(false);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetForm();
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Place Order</DialogTitle>
          <DialogDescription className="line-clamp-2">
            {market.title}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Order Type</label>
            <Select value={orderType} onChange={(e) => setOrderType(e.target.value as OrderType)}>
              <option value="market">Market</option>
              <option value="limit">Limit</option>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Outcome</label>
            <Select value={outcome} onChange={(e) => setOutcome(e.target.value as Outcome)}>
              <option value="yes">YES</option>
              <option value="no">NO</option>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Side</label>
            <Select value={side} onChange={(e) => setSide(e.target.value as OrderSide)}>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Size (USDC)</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="10.00"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              required
            />
          </div>

          {orderType === "limit" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Price (0-1)</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="1"
                placeholder="0.50"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          )}

          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 text-sm text-green-600 bg-green-100 dark:bg-green-900/20 rounded-md">
              Order placed successfully!
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Placing..." : "Place Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
