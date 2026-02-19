'use client'

import { useState } from 'react'
import { DollarSign, TrendingUp, TrendingDown, Calculator as CalcIcon } from 'lucide-react'

const EBAY_FEE = 0.13
const PAYMENT_FEE = 0.03
const TOTAL_FEE = EBAY_FEE + PAYMENT_FEE

export default function CalculatorPage() {
  const [buyPrice, setBuyPrice] = useState('')
  const [sellPrice, setSellPrice] = useState('')

  const buy = parseFloat(buyPrice) || 0
  const sell = parseFloat(sellPrice) || 0

  const totalFees = sell * TOTAL_FEE
  const ebayFeeAmount = sell * EBAY_FEE
  const paymentFeeAmount = sell * PAYMENT_FEE
  const netProfit = sell - totalFees - buy
  const roi = buy > 0 ? (netProfit / buy) * 100 : 0
  const breakEven = buy > 0 ? Math.ceil(buy / (1 - TOTAL_FEE)) : 0

  const hasInput = buy > 0 || sell > 0
  const isProfitable = netProfit > 0

  return (
    <div className="space-y-6">
      <h1 className="heading-font text-3xl">Profit Calculator</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="border-2 border-[#09090B] hard-shadow-sm bg-white p-6 space-y-5">
            <h2 className="heading-font text-lg">Deal Details</h2>

            <div className="space-y-2">
              <label className="block font-bold uppercase text-xs tracking-wider text-[#09090B]">
                Buy Price (FB Asking Price)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#09090B]/40" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="w-full pl-9 pr-4 py-2.5 border-2 border-[#09090B] rounded-none bg-white focus:ring-2 focus:ring-[#D2E823] focus:border-[#09090B] focus:outline-none"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-bold uppercase text-xs tracking-wider text-[#09090B]">
                Sell Price (eBay Estimated Sell)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#09090B]/40" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="w-full pl-9 pr-4 py-2.5 border-2 border-[#09090B] rounded-none bg-white focus:ring-2 focus:ring-[#D2E823] focus:border-[#09090B] focus:outline-none"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Fee Breakdown */}
            <div className="border-t-2 border-[#09090B]/10 pt-4 space-y-2">
              <h3 className="font-bold uppercase text-xs tracking-wider text-[#09090B]/50">Fee Breakdown</h3>
              <div className="flex justify-between text-sm">
                <span className="text-[#09090B]/60">eBay Fee (13%)</span>
                <span className="font-bold">${ebayFeeAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#09090B]/60">Payment Processing (3%)</span>
                <span className="font-bold">${paymentFeeAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-[#09090B]/10 pt-2">
                <span className="font-bold text-[#09090B]/70">Total Fees</span>
                <span className="font-bold">${totalFees.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {/* Net Profit */}
          <div className={`border-2 border-[#09090B] hard-shadow-sm p-6 ${
            hasInput
              ? isProfitable
                ? 'bg-green-50 border-green-600'
                : 'bg-red-50 border-red-600'
              : 'bg-white'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {hasInput && isProfitable ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : hasInput ? (
                <TrendingDown className="h-5 w-5 text-red-600" />
              ) : (
                <CalcIcon className="h-5 w-5 text-[#09090B]/40" />
              )}
              <span className="font-bold uppercase text-xs tracking-wider text-[#09090B]/50">Net Profit</span>
            </div>
            <div className={`heading-font text-4xl ${
              hasInput
                ? isProfitable ? 'text-green-600' : 'text-red-600'
                : 'text-[#09090B]/30'
            }`}>
              {hasInput ? `${netProfit >= 0 ? '+' : ''}$${netProfit.toFixed(2)}` : '$0.00'}
            </div>
          </div>

          {/* ROI */}
          <div className="border-2 border-[#09090B] hard-shadow-sm bg-white p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold uppercase text-xs tracking-wider text-[#09090B]/50">Return on Investment</span>
            </div>
            <div className={`heading-font text-3xl ${
              hasInput && buy > 0
                ? roi > 0 ? 'text-green-600' : 'text-red-600'
                : 'text-[#09090B]/30'
            }`}>
              {hasInput && buy > 0 ? `${roi.toFixed(1)}%` : '0.0%'}
            </div>
          </div>

          {/* Break-even */}
          <div className="border-2 border-[#09090B] hard-shadow-sm bg-white p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold uppercase text-xs tracking-wider text-[#09090B]/50">Break-Even Sell Price</span>
            </div>
            <div className="heading-font text-3xl text-[#09090B]">
              {buy > 0 ? `$${breakEven.toFixed(2)}` : '$0.00'}
            </div>
            <p className="text-xs text-[#09090B]/40 mt-1">Minimum sell price to cover costs + fees</p>
          </div>
        </div>
      </div>
    </div>
  )
}
