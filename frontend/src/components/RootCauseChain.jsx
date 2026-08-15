import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'

export function RootCauseChain({ chain }) {
  if (!chain || chain.length === 0) return null

  return (
    <div className="flex flex-col items-stretch">
      {chain.map((step, i) => (
        <div key={step} className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className={`w-full text-center px-4 py-3 rounded-md border text-sm font-medium ${
              i === chain.length - 1
                ? 'bg-status-critical/10 border-status-critical/40 text-status-critical'
                : 'bg-base-800 border-base-700/60 text-base-100'
            }`}
          >
            {step}
          </motion.div>
          {i < chain.length - 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.08 + 0.05 }}
              className="py-1.5 text-base-500"
            >
              <ArrowDown size={16} />
            </motion.div>
          )}
        </div>
      ))}
    </div>
  )
}

export default RootCauseChain
