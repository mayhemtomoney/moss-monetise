import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import NichePickerPage from './pages/NichePickerPage'
import BrandingStudioPage from './pages/BrandingStudioPage'
import BizBuilderPage from './pages/BizBuilderPage'
import ProductForgePage from './pages/ProductForgePage'
import PromptVaultPage from './pages/PromptVaultPage'

function App() {
    return (
        <Router>
            <Layout>
                <AnimatePresence mode="wait">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/niche-picker" element={<NichePickerPage />} />
                        <Route path="/branding-studio" element={<BrandingStudioPage />} />
                        <Route path="/biz-builder" element={<BizBuilderPage />} />
                        <Route path="/product-forge" element={<ProductForgePage />} />
                        <Route path="/prompt-vault" element={<PromptVaultPage />} />
                    </Routes>
                </AnimatePresence>
            </Layout>
        </Router>
    )
}

export default App
