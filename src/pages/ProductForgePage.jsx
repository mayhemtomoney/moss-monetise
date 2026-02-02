import { useState } from 'react'
import { motion } from 'framer-motion'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import usePuterAI from '../hooks/usePuterAI'
import useLocalStorage from '../hooks/useLocalStorage'
import templates from '../data/product-templates.json'

function ProductForgePage() {
    const [selectedTemplate, setSelectedTemplate] = useState(null)
    const [productDetails, setProductDetails] = useState({})
    const [generatedContent, setGeneratedContent] = useState(null)
    const [savedProducts, setSavedProducts] = useLocalStorage('moss-saved-products', [])
    const [showExportModal, setShowExportModal] = useState(false)

    const { generateProductDescription, isLoading } = usePuterAI()

    const handleSelectTemplate = (template) => {
        setSelectedTemplate(template)
        setProductDetails({})
        setGeneratedContent(null)
    }

    const handleInputChange = (field, value) => {
        setProductDetails(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const generateProduct = async () => {
        if (!selectedTemplate) return

        const details = {
            name: productDetails.title || `${selectedTemplate.name}`,
            features: Object.values(productDetails).join(', ')
        }

        try {
            const response = await generateProductDescription(selectedTemplate.name, details)

            // Parse the response
            setGeneratedContent({
                description: response,
                template: selectedTemplate.name,
                details: productDetails
            })
        } catch (err) {
            // Fallback content
            setGeneratedContent({
                description: `Welcome to your cozy ${selectedTemplate.name}! This lovingly crafted digital product is designed to bring warmth and organization to your daily life. Each page has been thoughtfully created with cottagecore aesthetics in mind, featuring gentle colors and calming layouts. Perfect for ${productDetails.audience || 'creative souls'} seeking a touch of peace in their busy lives.`,
                tagline: `Your cozy companion for ${selectedTemplate.name.toLowerCase()}`,
                keywords: ['cottagecore', 'digital product', 'cozy', selectedTemplate.name.toLowerCase(), 'printable'],
                template: selectedTemplate.name,
                details: productDetails
            })
        }
    }

    const saveProduct = () => {
        const product = {
            ...generatedContent,
            id: Date.now(),
            savedAt: new Date().toISOString()
        }
        setSavedProducts(prev => [...prev, product])
        setShowExportModal(true)
    }

    const exportToPdf = async () => {
        const html2canvas = (await import('html2canvas')).default
        const jsPDF = (await import('jspdf')).default

        const element = document.getElementById('product-preview')
        if (!element) return

        const canvas = await html2canvas(element, {
            backgroundColor: '#FDF8F0',
            scale: 2
        })
        const imgData = canvas.toDataURL('image/png')

        const pdf = new jsPDF('p', 'mm', 'a4')
        const imgWidth = 190
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight)
        pdf.save(`${selectedTemplate?.name || 'product'}-details.pdf`)
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto py-6 space-y-6"
        >
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl font-handwritten text-bark dark:text-linen mb-2">
                    📜 Pressed Flower Product Forge
                </h1>
                <p className="text-bark/70 dark:text-linen/70">
                    Craft beautiful digital products with AI assistance
                </p>
            </div>

            {/* Template Selection */}
            {!selectedTemplate && (
                <section>
                    <h2 className="text-2xl font-handwritten text-bark dark:text-linen mb-4 text-center">
                        Choose Your Creation
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {templates.templates.map((template) => (
                            <motion.div
                                key={template.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Card onClick={() => handleSelectTemplate(template)} className="text-center">
                                    <span className="text-4xl block mb-3">{template.icon}</span>
                                    <h3 className="text-xl font-handwritten text-bark dark:text-linen mb-2">
                                        {template.name}
                                    </h3>
                                    <p className="text-sm text-bark/60 dark:text-linen/60">
                                        {template.description}
                                    </p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* Product Builder */}
            {selectedTemplate && !generatedContent && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card hover={false}>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-3xl">{selectedTemplate.icon}</span>
                            <div>
                                <h2 className="text-2xl font-handwritten text-bark dark:text-linen">
                                    {selectedTemplate.name}
                                </h2>
                                <button
                                    onClick={() => setSelectedTemplate(null)}
                                    className="text-sm text-moss hover:underline"
                                >
                                    ← Choose different template
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {selectedTemplate.fields.map((field) => (
                                <div key={field}>
                                    <label className="block text-sm font-medium text-bark dark:text-linen mb-2 capitalize">
                                        {field.replace(/_/g, ' ')}
                                    </label>
                                    <input
                                        type="text"
                                        value={productDetails[field] || ''}
                                        onChange={(e) => handleInputChange(field, e.target.value)}
                                        placeholder={`Enter ${field}...`}
                                        className="w-full p-3 rounded-xl border-2 border-moss/20 focus:border-moss bg-cream dark:bg-bark/30 text-bark dark:text-linen outline-none transition-colors"
                                    />
                                </div>
                            ))}

                            <Button
                                onClick={generateProduct}
                                loading={isLoading}
                                className="w-full mt-6"
                            >
                                ✨ Generate Product Description
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            )}

            {/* Generated Content */}
            {generatedContent && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <Card hover={false} id="product-preview">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-handwritten text-moss-deep dark:text-moss-light">
                                {selectedTemplate?.icon} Your Product
                            </h2>
                            <Badge variant="bloom">AI Generated</Badge>
                        </div>

                        {/* Preview */}
                        <div className="bg-linen-light/30 dark:bg-bark/20 p-6 rounded-xl mb-6">
                            <h3 className="text-xl font-handwritten text-bark dark:text-linen mb-3">
                                {productDetails.title || selectedTemplate?.name}
                            </h3>

                            <p className="text-bark/80 dark:text-linen/80 mb-4 whitespace-pre-wrap">
                                {generatedContent.description}
                            </p>

                            {generatedContent.tagline && (
                                <p className="text-moss italic mb-3">
                                    "{generatedContent.tagline}"
                                </p>
                            )}

                            {generatedContent.keywords && (
                                <div>
                                    <span className="text-sm font-medium text-bark/60 dark:text-linen/60">SEO Keywords:</span>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {generatedContent.keywords.map((keyword, i) => (
                                            <Badge key={i} variant="linen">{keyword}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3">
                            <Button onClick={saveProduct} variant="moss">
                                💾 Save Product
                            </Button>
                            <Button onClick={exportToPdf} variant="linen">
                                📄 Export PDF
                            </Button>
                            <Button onClick={() => setGeneratedContent(null)} variant="ghost">
                                ✏️ Edit Details
                            </Button>
                            <Button onClick={() => {
                                setSelectedTemplate(null)
                                setGeneratedContent(null)
                                setProductDetails({})
                            }} variant="ghost">
                                🔄 Start New
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            )}

            {/* Saved Products */}
            {savedProducts.length > 0 && (
                <Card hover={false}>
                    <h3 className="text-lg font-handwritten text-bark dark:text-linen mb-3">
                        Your Product Collection
                    </h3>
                    <div className="grid gap-2">
                        {savedProducts.slice(-5).reverse().map((product) => (
                            <div
                                key={product.id}
                                className="flex items-center justify-between p-3 bg-linen-light/30 dark:bg-bark/20 rounded-xl"
                            >
                                <span className="font-medium text-bark dark:text-linen">
                                    {product.details?.title || product.template}
                                </span>
                                <span className="text-sm text-bark/60 dark:text-linen/60">
                                    {new Date(product.savedAt).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Export Modal */}
            <Modal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                title="Product Saved! 📜"
            >
                <p className="mb-4">
                    Your product details have been saved to your collection. You can access them anytime or export as PDF.
                </p>
                <Button onClick={() => setShowExportModal(false)}>
                    Continue Creating
                </Button>
            </Modal>
        </motion.div>
    )
}

export default ProductForgePage
