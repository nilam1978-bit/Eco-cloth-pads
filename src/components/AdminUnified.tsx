import React, { useState, useMemo } from 'react';
import { 
  Edit, Trash2, Plus, Search, Settings, ShoppingBag, X, ChevronDown, ChevronUp, 
  Folder, FileText, Database, Github, Lock, Upload, Check, Eye, EyeOff, 
  RefreshCw, HelpCircle, BookOpen, AlertTriangle, LogOut
} from 'lucide-react';

const RTS_NAME_MAP: Record<string, string> = {
  'Liner': 'Mini Pantyliner',
  'Light': 'Light Day Pad',
  'Moderate': 'Regular Day Pad',
  'Moderate dry': 'Regular Day Pad',
  'Heavy': 'Heavy Night Pad',
  'Heavy dry': 'Heavy Night Pad',
  'Extra Long': 'Overnight Safety Pad'
};

const SHAPE_LABELS: Record<string, string> = {
  'moon_rise': '🌙 MoonRise',
  'sunglow': '☀️ SunGlow',
  'staple': '📎 Staple',
  'mega_pad': '👑 MegaPad'
};

interface AdminUnifiedProps {
  fabricsTop: any[];
  setFabricsTop: (val: any[]) => void;
  fabricsBacking: any[];
  setFabricsBacking: (val: any[]) => void;
  sizeOptions: any[];
  setSizeOptions: (val: any[]) => void;
  absorbencyOptions: any[];
  setAbsorbencyOptions: (val: any[]) => void;
  readyMadeStocks: any[];
  setReadyMadeStocks: (val: any[]) => void;
  shapeOptions: any[];
  setShapeOptions: (val: any[]) => void;
  washingFaq: any[];
  setWashingFaq: (val: any[]) => void;
  blogPosts: any[];
  feedback: any[];
  setBlogPosts: (val: any[]) => void;

  categories: string[];
  setCategories: (val: string[]) => void;
  editingCategoriesText: string;
  setEditingCategoriesText: (val: string) => void;
  shopLogoUrl: string;
  setShopLogoUrl: (val: string) => void;
  merchantEmail: string;
  setMerchantEmail: (val: string) => void;
  merchantPhone: string;
  setMerchantPhone: (val: string) => void;

  saveDatabase: (updatedDb: any) => Promise<boolean>;
  handleUploadToR2: (file: File) => Promise<string>;
  activePassword: string;
  setActivePassword: (val: string) => void;
  setIsAdminAuthenticated: (val: boolean) => void;
  setAdminPasswordInput: (val: string) => void;

  adminSuccess: string;
  setAdminSuccess: (val: string) => void;
  adminError: string;
  setAdminError: (val: string) => void;

  lookbookPhotos: any[];
  setLookbookPhotos: (val: any[]) => void;
  isLoadingPhotos: boolean;
  setIsLoadingPhotos: (val: boolean) => void;

  publishToGithub: () => Promise<void>;
  isPublishingToGithub: boolean;
  ghOwner: string;
  setGhOwner: (val: string) => void;
  ghRepo: string;
  setGhRepo: (val: string) => void;
  ghBranch: string;
  setGhBranch: (val: string) => void;
  ghCommitMsg: string;
  setGhCommitMsg: (val: string) => void;

  firebaseStatus: any;
  setFirebaseStatus: (val: any) => void;
  isR2Mock: boolean;
  onClose?: () => void;
  hideLookbookInBackOffice: boolean;
  toggleHideLookbookInBackOffice: (val: boolean) => Promise<boolean>;
}

export const AdminUnified: React.FC<AdminUnifiedProps> = ({
  fabricsTop, setFabricsTop, fabricsBacking, setFabricsBacking,
  sizeOptions, setSizeOptions, absorbencyOptions, setAbsorbencyOptions,
  readyMadeStocks, setReadyMadeStocks, shapeOptions, setShapeOptions,
  washingFaq, setWashingFaq, blogPosts, setBlogPosts, feedback,
  categories, setCategories, editingCategoriesText, setEditingCategoriesText,
  shopLogoUrl, setShopLogoUrl, merchantEmail, setMerchantEmail, merchantPhone, setMerchantPhone,
  saveDatabase, handleUploadToR2, activePassword, setActivePassword,
  setIsAdminAuthenticated, setAdminPasswordInput,
  adminSuccess, setAdminSuccess, adminError, setAdminError,
  lookbookPhotos, setLookbookPhotos, isLoadingPhotos, setIsLoadingPhotos,
  publishToGithub, isPublishingToGithub, ghOwner, setGhOwner, ghRepo, setGhRepo,
  ghBranch, setGhBranch, ghCommitMsg, setGhCommitMsg,
  firebaseStatus, isR2Mock, onClose, hideLookbookInBackOffice, toggleHideLookbookInBackOffice
}) => {
  // Navigation State
  const [activeSidebar, setActiveSidebar] = useState<'shop' | 'settings'>('shop');
  const [activeShopTab, setActiveShopTab] = useState<'fabrics' | 'pads' | 'pricing' | 'faq' | 'blog' | 'categories' | 'feedback'>('fabrics');
  const [activeSettingsTab, setActiveSettingsTab] = useState<'routing' | 'publishing' | 'database' | 'danger'>('routing');
  const [searchQuery, setSearchQuery] = useState('');

  // Collapsible Categories
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  // Modal control states
  const [fabricModalOpen, setFabricModalOpen] = useState(false);
  const [editingFabric, setEditingFabric] = useState<any | null>(null);

  const [rtsModalOpen, setRtsModalOpen] = useState(false);
  const [editingRts, setEditingRts] = useState<any | null>(null);

  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any | null>(null);

  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);

  // Form Field States
  // Fabrics
  const [fabName, setFabName] = useState('');
  const [fabCategory, setFabCategory] = useState('');
  const [fabMaterial, setFabMaterial] = useState('');
  const [fabPremium, setFabPremium] = useState('0.00');
  const [fabProperties, setFabProperties] = useState('');
  const [fabStock, setFabStock] = useState<'in_stock' | 'low_stock' | 'out_of_stock'>('in_stock');
  const [fabImageUrl, setFabImageUrl] = useState('');
  const [isUploadingFab, setIsUploadingFab] = useState(false);

  // Ready Made Stocks
  const [rtsName, setRtsName] = useState('');
  const [rtsDescription, setRtsDescription] = useState('');
  const [rtsPrice, setRtsPrice] = useState('15.00');
  const [rtsSize, setRtsSize] = useState('Regular Day (8")');
  const [rtsPrint, setRtsPrint] = useState('');
  const [rtsAbsorbency, setRtsAbsorbency] = useState('Moderate dry');
  const [rtsQuantity, setRtsQuantity] = useState('1');
  const [rtsImageUrl, setRtsImageUrl] = useState('');
  const [rtsNotes, setRtsNotes] = useState('');
  const [rtsShape, setRtsShape] = useState('');
  const [isUploadingRts, setIsUploadingRts] = useState(false);

  // FAQ Fields
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');

  // Blog Fields
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogImageUrl, setBlogImageUrl] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('WonderPads');
  const [isUploadingBlog, setIsUploadingBlog] = useState(false);

  // Pricing Table Inline Edit State
  const [editingSizeId, setEditingSizeId] = useState<string | null>(null);
  const [inlineLabel, setInlineLabel] = useState('');
  const [inlineLength, setInlineLength] = useState('8');
  const [inlinePrice, setInlinePrice] = useState('11.00');
  const [inlineBackingUpgrade, setInlineBackingUpgrade] = useState('0.00');
  const [inlineLayerUpgrade, setInlineLayerUpgrade] = useState('0.00');

  // Inline Add Size State
  const [isAddingSize, setIsAddingSize] = useState(false);
  const [addSizeId, setAddSizeId] = useState('');
  const [addSizeLabel, setAddSizeLabel] = useState('');
  const [addSizeLength, setAddSizeLength] = useState('8');
  const [addSizePrice, setAddSizePrice] = useState('11.00');
  const [addSizeBackingUpgrade, setAddSizeBackingUpgrade] = useState('0.00');
  const [addSizeLayerUpgrade, setAddSizeLayerUpgrade] = useState('0.00');

  // Settings Field States
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isAutoMatching, setIsAutoMatching] = useState(false);
  const [showEraseConfirm, setShowEraseConfirm] = useState(false);
  const [eraseConfirmText, setEraseConfirmText] = useState('');

  // Bulk import
  const [rtsBulkImportTag, setRtsBulkImportTag] = useState('pads');
  const [isRtsBulkImporting, setIsRtsBulkImporting] = useState(false);
  const [showAdvancedImport, setShowAdvancedImport] = useState(false);
  const [rtsBulkPreview, setRtsBulkPreview] = useState<any[] | null>(null);
  const [rtsBulkSize, setRtsBulkSize] = useState('Regular Day (8")');
  const [rtsBulkAbsorbency, setRtsBulkAbsorbency] = useState('Moderate dry');
  const [rtsBulkPrice, setRtsBulkPrice] = useState('15.00');

  // Fabric bulk import
  const [showFabricAdvancedImport, setShowFabricAdvancedImport] = useState(false);
  const [fabricBulkImportTag, setFabricBulkImportTag] = useState('');
  const [isFabricBulkImporting, setIsFabricBulkImporting] = useState(false);
  const [fabricBulkPreview, setFabricBulkPreview] = useState<any[] | null>(null);
  const [fabricBulkCategory, setFabricBulkCategory] = useState('');
  const [fabricBulkMaterial, setFabricBulkMaterial] = useState('Cotton Woven');
  const [fabricBulkType, setFabricBulkType] = useState<'top' | 'backing'>('top');

  // Toggle collapses
  const toggleCategory = (catName: string) => {
    setCollapsedCategories(prev => ({ ...prev, [catName]: !prev[catName] }));
  };

  // Trigger Fabric Modal
  const openFabricModal = (item: any | null = null) => {
    setEditingFabric(item);
    if (item) {
      setFabName(item.name || '');
      setFabCategory(item.type === 'backing' ? 'Backing Fabric' : (item.category || categories[0] || 'Flowers'));
      setFabMaterial(item.material || '');
      setFabPremium((item.premium || 0).toString());
      setFabProperties((item.properties || []).join(', '));
      setFabStock(item.stockStatus || 'in_stock');
      setFabImageUrl(item.imageUrl || '');
    } else {
      setFabName('');
      setFabCategory(categories[0] || 'Flowers');
      setFabMaterial('Cotton Woven');
      setFabPremium('0.00');
      setFabProperties('');
      setFabStock('in_stock');
      setFabImageUrl('');
    }
    setFabricModalOpen(true);
  };

  // Save Fabric Print
  const handleSaveFabric = async () => {
    if (!fabName.trim()) {
      setAdminError('Fabric print name is required.');
      return;
    }
    const isBacking = fabCategory === 'Backing Fabric';
    const parsedPremium = parseFloat(fabPremium) || 0;
    const parsedProps = fabProperties.split(',').map(s => s.trim()).filter(Boolean);

    let updatedTops = [...fabricsTop];
    let updatedBackings = [...fabricsBacking];

    if (editingFabric) {
      // Remove from both first
      updatedTops = updatedTops.filter(x => x.id !== editingFabric.id);
      updatedBackings = updatedBackings.filter(x => x.id !== editingFabric.id);

      const updatedObj = {
        ...editingFabric,
        name: fabName.trim(),
        type: isBacking ? 'backing' : 'top',
        material: fabMaterial.trim(),
        premium: parsedPremium,
        properties: parsedProps,
        stockStatus: fabStock,
        category: isBacking ? 'Backing Fabric' : fabCategory,
        imageUrl: fabImageUrl.trim() || editingFabric.imageUrl
      };

      if (isBacking) updatedBackings.push(updatedObj);
      else updatedTops.push(updatedObj);
    } else {
      const newObj = {
        id: 'fab-' + Date.now(),
        name: fabName.trim(),
        type: isBacking ? 'backing' : 'top',
        material: fabMaterial.trim(),
        description: 'Wonder Premium Pattern',
        colorHex: '#ffffff',
        premium: parsedPremium,
        properties: parsedProps,
        stockStatus: fabStock,
        category: isBacking ? 'Backing Fabric' : fabCategory,
        imageUrl: fabImageUrl.trim() || 'https://images.unsplash.com/photo-1606293926075-69a00dbf9816?auto=format&fit=crop&q=80&w=200',
        hidden: false
      };

      if (isBacking) updatedBackings.push(newObj);
      else updatedTops.push(newObj);
    }

    setFabricsTop(updatedTops);
    setFabricsBacking(updatedBackings);
    const success = await saveDatabase({ fabricsTop: updatedTops, fabricsBacking: updatedBackings });
    if (success) {
      setAdminSuccess(editingFabric ? 'Fabric print updated successfully!' : 'Fabric print added successfully!');
      setFabricModalOpen(false);
    }
  };

  // Delete Fabric
  const handleDeleteFabric = async (item: any) => {
    if (!window.confirm(`Are you sure you want to delete fabric "${item.name}"?`)) return;
    const updatedTops = fabricsTop.filter(x => x.id !== item.id);
    const updatedBackings = fabricsBacking.filter(x => x.id !== item.id);
    setFabricsTop(updatedTops);
    setFabricsBacking(updatedBackings);
    await saveDatabase({ fabricsTop: updatedTops, fabricsBacking: updatedBackings });
    setAdminSuccess('Fabric print deleted successfully.');
  };

  // Fabric Bulk Import — Step 1: preview matches, no DB writes yet
  const handlePreviewFabricBulkImport = async () => {
    if (!fabricBulkImportTag.trim()) return;
    try {
      setIsFabricBulkImporting(true);
      const response = await fetch('/api/lookbook-photos');
      if (response.ok) {
        const data = await response.json();
        const photos = (data.photos || []).map((ph: any) => ({
          filename: ph.filename, url: ph.secure_url
        }));
        const filtered = photos.filter((p: any) => p.filename.toLowerCase().includes(fabricBulkImportTag.toLowerCase().trim()));
        if (filtered.length === 0) {
          alert(`No photos found matching keyword "${fabricBulkImportTag}".`);
          setFabricBulkPreview(null);
        } else {
          setFabricBulkPreview(filtered);
        }
      }
    } catch (err: any) {
      setAdminError('Preview failed: ' + err.message);
    } finally {
      setIsFabricBulkImporting(false);
    }
  };

  // Fabric Bulk Import — Step 2: confirm and actually create fabric entries
  const handleConfirmFabricBulkImport = async () => {
    if (!fabricBulkPreview || fabricBulkPreview.length === 0) return;

    if (fabricBulkType === 'backing') {
      const importedBackings = fabricBulkPreview.map((p: any, index: number) => ({
        id: 'fab-' + Date.now() + '-' + index,
        name: p.filename.split('.')[0].replace(/[-_]+/g, ' '),
        type: 'backing',
        material: fabricBulkMaterial.trim() || 'Cotton Woven',
        description: 'Wonder Premium Backing',
        colorHex: '#ffffff',
        premium: 0,
        properties: [],
        stockStatus: 'in_stock',
        category: 'Backing Fabric',
        imageUrl: p.url,
        hidden: false
      }));

      const updatedBackings = [...fabricsBacking, ...importedBackings];
      setFabricsBacking(updatedBackings);
      const success = await saveDatabase({ fabricsBacking: updatedBackings });
      if (success) {
        setAdminSuccess(`Successfully bulk-imported ${importedBackings.length} backing fabrics!`);
        setShowFabricAdvancedImport(false);
        setFabricBulkPreview(null);
        setFabricBulkImportTag('');
      }
      return;
    }

    const chosenCategory = fabricBulkCategory || categories[0] || 'Flowers';
    const importedFabrics = fabricBulkPreview.map((p: any, index: number) => ({
      id: 'fab-' + Date.now() + '-' + index,
      name: p.filename.split('.')[0].replace(/[-_]+/g, ' '),
      type: 'top',
      material: fabricBulkMaterial.trim() || 'Cotton Woven',
      description: 'Wonder Premium Pattern',
      colorHex: '#ffffff',
      premium: 0,
      properties: [],
      stockStatus: 'in_stock',
      category: chosenCategory,
      imageUrl: p.url,
      hidden: false
    }));

    const updatedTops = [...fabricsTop, ...importedFabrics];
    setFabricsTop(updatedTops);
    const success = await saveDatabase({ fabricsTop: updatedTops });
    if (success) {
      setAdminSuccess(`Successfully bulk-imported ${importedFabrics.length} fabric prints into "${chosenCategory}"!`);
      setShowFabricAdvancedImport(false);
      setFabricBulkPreview(null);
      setFabricBulkImportTag('');
    }
  };

  // Trigger RTS Modal
  const openRtsModal = (item: any | null = null) => {
    setEditingRts(item);
    if (item) {
      setRtsName(item.name || '');
      setRtsDescription(item.description || '');
      setRtsPrice((item.price || 15.00).toString());
      setRtsSize(item.size || '8 inch');
      setRtsPrint(item.print || '');
      setRtsAbsorbency(item.absorbency || 'Moderate dry');
      setRtsQuantity((item.quantityLeft || 1).toString());
      setRtsImageUrl(item.imageUrl || '');
      setRtsNotes(item.adminNotes || '');
      setRtsShape(item.shape || '');
    } else {
      setRtsName('');
      setRtsDescription('');
      setRtsPrice('15.00');
      setRtsSize('Regular Day (8")');
      setRtsPrint('');
      setRtsAbsorbency('Moderate dry');
      setRtsQuantity('1');
      setRtsImageUrl('');
      setRtsNotes('');
      setRtsShape('');
    }
    setRtsModalOpen(true);
  };

  // Save Ready-Made Stock Item
  const handleSaveRts = async () => {
    if (!rtsAbsorbency) {
      setAdminError('Product type is required.');
      return;
    }
    const calculatedName = rtsName.trim() || RTS_NAME_MAP[rtsAbsorbency] || rtsAbsorbency;
    const parsedPrice = parseFloat(rtsPrice) || 15.00;
    const parsedQty = parseInt(rtsQuantity) || 1;

    let updatedList = [...readyMadeStocks];

    if (editingRts) {
      const updatedObj = {
        ...editingRts,
        name: calculatedName,
        description: rtsDescription.trim(),
        price: parsedPrice,
        quantityLeft: parsedQty,
        size: rtsSize,
        sizeLabel: rtsSize,
        print: rtsPrint.trim(),
        printLabel: rtsPrint.trim(),
        absorbency: rtsAbsorbency,
        absorbencyLabel: rtsAbsorbency,
        imageUrl: rtsImageUrl.trim() || editingRts.imageUrl,
        adminNotes: rtsNotes.trim(),
        shape: rtsShape
      };
      updatedList = updatedList.map(x => x.id === editingRts.id ? updatedObj : x);
    } else {
      const newObj = {
        id: 'rts-' + Date.now(),
        name: calculatedName,
        description: rtsDescription.trim() || 'Pre-crafted limited release pack ready for immediate dispatch',
        price: parsedPrice,
        quantityLeft: parsedQty,
        size: rtsSize,
        sizeLabel: rtsSize,
        print: rtsPrint.trim(),
        printLabel: rtsPrint.trim(),
        absorbency: rtsAbsorbency,
        absorbencyLabel: rtsAbsorbency,
        imageUrl: rtsImageUrl.trim() || 'https://images.unsplash.com/photo-1606293926075-69a00dbf9816?auto=format&fit=crop&q=80&w=200',
        adminNotes: rtsNotes.trim(),
        shape: rtsShape,
        hidden: false
      };
      updatedList.push(newObj);
    }

    setReadyMadeStocks(updatedList);
    const success = await saveDatabase({ readyMadeStocks: updatedList });
    if (success) {
      setAdminSuccess(editingRts ? 'Ready-Made Pad updated successfully!' : 'Ready-Made Pad added successfully!');
      setRtsModalOpen(false);
    }
  };

  // Delete RTS Pad
  const handleDeleteRts = async (item: any) => {
    if (!window.confirm(`Are you sure you want to delete ready-made pad "${item.print || item.name}"?`)) return;
    const updated = readyMadeStocks.filter(x => x.id !== item.id);
    setReadyMadeStocks(updated);
    await saveDatabase({ readyMadeStocks: updated });
    setAdminSuccess('Ready-Made Pad deleted successfully.');
  };

  // Trigger FAQ Modal
  const openFaqModal = (item: any | null = null) => {
    setEditingFaq(item);
    if (item) {
      setFaqQuestion(item.question || '');
      setFaqAnswer(item.answer || '');
    } else {
      setFaqQuestion('');
      setFaqAnswer('');
    }
    setFaqModalOpen(true);
  };

  // Save FAQ Question
  const handleSaveFaq = async () => {
    if (!faqQuestion.trim() || !faqAnswer.trim()) {
      setAdminError('Question and Answer are required.');
      return;
    }
    let updatedList = [...washingFaq];
    const newFaq = { question: faqQuestion.trim(), answer: faqAnswer.trim() };

    if (editingFaq) {
      updatedList = updatedList.map(x => x.question === editingFaq.question ? newFaq : x);
    } else {
      updatedList.push(newFaq);
    }

    setWashingFaq(updatedList);
    const success = await saveDatabase({ washingFaq: updatedList });
    if (success) {
      setAdminSuccess('FAQ saved successfully!');
      setFaqModalOpen(false);
    }
  };

  // Delete FAQ
  const handleDeleteFaq = async (item: any) => {
    if (!window.confirm(`Delete this FAQ question?`)) return;
    const updated = washingFaq.filter(x => x.question !== item.question);
    setWashingFaq(updated);
    await saveDatabase({ washingFaq: updated });
    setAdminSuccess('FAQ question deleted.');
  };

  // Trigger Blog Modal
  const openBlogModal = (item: any | null = null) => {
    setEditingBlog(item);
    if (item) {
      setBlogTitle(item.title || '');
      setBlogContent(item.content || '');
      setBlogImageUrl(item.imageUrl || '');
      setBlogAuthor(item.author || 'WonderPads');
    } else {
      setBlogTitle('');
      setBlogContent('');
      setBlogImageUrl('');
      setBlogAuthor('WonderPads');
    }
    setBlogModalOpen(true);
  };

  // Save Blog Post
  const handleSaveBlog = async () => {
    if (!blogTitle.trim() || !blogContent.trim()) {
      setAdminError('Title and Content are required.');
      return;
    }
    let updatedList = [...blogPosts];

    if (editingBlog) {
      const updatedObj = {
        ...editingBlog,
        title: blogTitle.trim(),
        content: blogContent.trim(),
        imageUrl: blogImageUrl.trim() || editingBlog.imageUrl,
        author: blogAuthor.trim() || 'WonderPads'
      };
      updatedList = updatedList.map(x => x.id === editingBlog.id ? updatedObj : x);
    } else {
      const newObj = {
        id: 'blog-' + Date.now(),
        title: blogTitle.trim(),
        content: blogContent.trim(),
        imageUrl: blogImageUrl.trim() || 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&q=80&w=400',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        author: blogAuthor.trim() || 'WonderPads'
      };
      updatedList.push(newObj);
    }

    setBlogPosts(updatedList);
    const success = await saveDatabase({ blogPosts: updatedList });
    if (success) {
      setAdminSuccess('Blog post saved successfully!');
      setBlogModalOpen(false);
    }
  };

  // Delete Blog Post
  const handleDeleteBlog = async (item: any) => {
    if (!window.confirm(`Delete blog post "${item.title}"?`)) return;
    const updated = blogPosts.filter(x => x.id !== item.id);
    setBlogPosts(updated);
    await saveDatabase({ blogPosts: updated });
    setAdminSuccess('Blog post deleted.');
  };

  // Start Inline Sizing Edit
  const startInlineEdit = (size: any) => {
    setEditingSizeId(size.id);
    setInlineLabel(size.displayLabel || size.name || '');
    setInlineLength((size.lengthInches || 8).toString());
    setInlinePrice((size.basePrice || size.priceBase || 11.00).toString());
    setInlineBackingUpgrade((size.backingUpgrade || 0).toString());
    setInlineLayerUpgrade((size.layerUpgrade || size.additionalLayerUpgrade || 0).toString());
  };

  // Save Inline Sizing row
  const saveInlineEdit = async (sizeId: string) => {
    const updatedList = sizeOptions.map(s => {
      if (s.id === sizeId) {
        return {
          ...s,
          displayLabel: inlineLabel,
          lengthInches: parseFloat(inlineLength) || s.lengthInches || 8,
          basePrice: parseFloat(inlinePrice) || 11.00,
          priceBase: parseFloat(inlinePrice) || 11.00,
          backingUpgrade: parseFloat(inlineBackingUpgrade) || 0,
          layerUpgrade: parseFloat(inlineLayerUpgrade) || 0,
          additionalLayerUpgrade: parseFloat(inlineLayerUpgrade) || 0
        };
      }
      return s;
    });

    setSizeOptions(updatedList);
    const success = await saveDatabase({ sizeOptions: updatedList });
    if (success) {
      setAdminSuccess('Pricing configuration updated!');
      setEditingSizeId(null);
    }
  };

  // Add Size Inline Save
  const handleAddSizeInline = async () => {
    const cleanId = addSizeId.trim().toLowerCase().replace(/\s+/g, '_');
    if (!cleanId || !addSizeLabel.trim()) {
      setAdminError('Size ID and Display Label are required.');
      return;
    }
    if (sizeOptions.some(s => s.id === cleanId)) {
      setAdminError(`Size ID "${cleanId}" already exists.`);
      return;
    }

    const newSz = {
      id: cleanId,
      name: addSizeLabel.trim().split(' ')[0] || 'Custom',
      displayLabel: addSizeLabel.trim(),
      lengthInches: parseFloat(addSizeLength) || 8,
      basePrice: parseFloat(addSizePrice) || 11.00,
      priceBase: parseFloat(addSizePrice) || 11.00,
      backingUpgrade: parseFloat(addSizeBackingUpgrade) || 0,
      layerUpgrade: parseFloat(addSizeLayerUpgrade) || 0,
      additionalLayerUpgrade: parseFloat(addSizeLayerUpgrade) || 0,
      description: 'Custom added sizing model',
      widthCm: 20,
      minLength: parseFloat(addSizeLength) || 8,
      maxLength: parseFloat(addSizeLength) || 8
    };

    const updated = [...sizeOptions, newSz];
    setSizeOptions(updated);
    const success = await saveDatabase({ sizeOptions: updated });
    if (success) {
      setAdminSuccess('Added new pad size successfully!');
      setIsAddingSize(false);
      setAddSizeId('');
      setAddSizeLabel('');
      setAddSizeLength('8');
      setAddSizePrice('11.00');
      setAddSizeBackingUpgrade('0.00');
      setAddSizeLayerUpgrade('0.00');
    }
  };

  // Delete Size Option
  const handleDeleteSizeOption = async (item: any) => {
    if (!window.confirm(`Delete pad size ${item.displayLabel || item.id}?`)) return;
    const updated = sizeOptions.filter(x => x.id !== item.id);
    setSizeOptions(updated);
    await saveDatabase({ sizeOptions: updated });
    setAdminSuccess('Pad Size deleted.');
  };

  // Sync / Auto Match filenames with photos in lookbook
  const runAutoMatch = async () => {
    try {
      setIsAutoMatching(true);
      setAdminSuccess('');
      setAdminError('');

      if (!lookbookPhotos || lookbookPhotos.length === 0) {
        setAdminError('No lookbook photos uploaded to match.');
        return;
      }

      const normalize = (str: string): string => {
        if (!str) return '';
        let s = str.substring(0, str.lastIndexOf('.')) || str;
        s = s.replace(/^(rts-fabric-|wp-fabric-|rts_fabric_|wp_fabric_|lookbook_|rts-|-rts-|fabric-)/gi, '');
        return s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().trim();
      };

      let matchCountFab = 0;
      let matchCountRts = 0;

      const updatedTops = fabricsTop.map(f => {
        const normName = normalize(f.name);
        const match = lookbookPhotos.find(p => normalize(p.filename) === normName);
        if (match) {
          matchCountFab++;
          return { ...f, imageUrl: match.secure_url };
        }
        return f;
      });

      const updatedBackings = fabricsBacking.map(f => {
        const normName = normalize(f.name);
        const match = lookbookPhotos.find(p => normalize(p.filename) === normName);
        if (match) {
          matchCountFab++;
          return { ...f, imageUrl: match.secure_url };
        }
        return f;
      });

      const updatedRts = readyMadeStocks.map(r => {
        const normPrint = normalize(r.print);
        const normName = normalize(r.name);
        const match = lookbookPhotos.find(p => {
          const fn = normalize(p.filename);
          return fn === normPrint || fn === normName;
        });
        if (match) {
          matchCountRts++;
          return { ...r, imageUrl: match.secure_url };
        }
        return r;
      });

      if (matchCountFab === 0 && matchCountRts === 0) {
        setAdminError('No matching filename pairs found. Ensure R2 photos match fabric/RTS print names.');
        return;
      }

      setFabricsTop(updatedTops);
      setFabricsBacking(updatedBackings);
      setReadyMadeStocks(updatedRts);

      const success = await saveDatabase({
        fabricsTop: updatedTops,
        fabricsBacking: updatedBackings,
        readyMadeStocks: updatedRts
      });

      if (success) {
        setAdminSuccess(`Paired ${matchCountFab} fabrics and ${matchCountRts} RTS items!`);
      }
    } catch (err: any) {
      setAdminError('Auto-matching error: ' + err.message);
    } finally {
      setIsAutoMatching(false);
    }
  };

  // Group Fabrics & Backings
  const fabricsByCategory = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    // Add categories from props first
    categories.forEach(cat => { grouped[cat] = []; });
    // Add "Backing Fabric"
    grouped['Backing Fabric'] = [];

    fabricsTop.forEach(f => {
      const cat = f.category || categories[0] || 'Flowers';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(f);
    });

    fabricsBacking.forEach(f => {
      grouped['Backing Fabric'].push(f);
    });

    // Filter out empty groups, but keep them if we want
    return grouped;
  }, [fabricsTop, fabricsBacking, categories]);

  // Group RTS
  const rtsByCategory = useMemo(() => {
    const getRtsType = (item: any) => {
      const name = (item.name || '').toLowerCase();
      if (name.includes('liner')) return 'Liner';
      if (name.includes('light')) return 'Light';
      if (name.includes('moderate') || name.includes('regular')) return 'Moderate';
      if (name.includes('heavy') || name.includes('night')) return 'Heavy';
      if (name.includes('extra long') || name.includes('overnight')) return 'Extra Long';
      return 'Others';
    };

    const grouped: Record<string, any[]> = {
      'Liner': [], 'Light': [], 'Moderate': [], 'Heavy': [], 'Extra Long': [], 'Others': []
    };

    readyMadeStocks.forEach(item => {
      const cat = getRtsType(item);
      grouped[cat].push(item);
    });

    return grouped;
  }, [readyMadeStocks]);

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-[#FCFAF6] font-sans text-zinc-800">
      
      {/* LEFT SIDEBAR (Desktop only) */}
      <div className="hidden md:flex md:w-60 bg-[#FCFAF6] md:border-r border-[#EBE3D5] flex-col justify-between p-6 shrink-0">
        <div className="space-y-8">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#EBE3D5]/40">
            {shopLogoUrl ? (
              <img src={shopLogoUrl} alt="Logo" className="h-8 w-8 object-contain rounded-lg animate-fadeIn" referrerPolicy="no-referrer" />
            ) : (
              <div className="h-8 w-8 bg-[#922B50] text-white rounded-lg flex items-center justify-center font-black text-xs shadow-3xs">WP</div>
            )}
            <div>
              <h3 className="font-serif font-bold text-[14px] tracking-wide leading-tight text-[#2E1B26]">WonderPads</h3>
              <p className="text-[8.5px] text-[#8F7080] uppercase font-black tracking-widest mt-0.5">Back Office</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 px-2 text-[#8F7080]">
              <span className="text-xs">⊞</span>
              <p className="text-[10px] uppercase font-black tracking-wider">Navigation</p>
            </div>
            
            <button
              type="button"
              onClick={() => {
                setActiveSidebar('shop');
                setAdminError('');
                setAdminSuccess('');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium transition-all cursor-pointer ${
                activeSidebar === 'shop' 
                  ? 'text-[#2E1B26] font-bold' 
                  : 'text-[#8F7080] hover:text-[#2E1B26]'
              }`}
            >
              <ShoppingBag className="h-4 w-4 shrink-0 text-[#922B50]" />
              <span>Shop</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveSidebar('settings');
                setAdminError('');
                setAdminSuccess('');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium transition-all cursor-pointer ${
                activeSidebar === 'settings' 
                  ? 'text-[#2E1B26] font-bold' 
                  : 'text-[#8F7080] hover:text-[#2E1B26]'
              }`}
            >
              <Settings className="h-4 w-4 shrink-0 text-[#8F7080]" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-[#EBE3D5]/40">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              🚪 Exit Back Office
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setIsAdminAuthenticated(false);
              setAdminPasswordInput('');
              localStorage.removeItem('admin_session_auth');
              setAdminSuccess('Signed out of administrative session.');
            }}
            className="w-full text-center text-[8.5px] font-black uppercase text-zinc-400 tracking-widest hover:text-zinc-600 hover:underline py-1"
          >
            Sign Out of Session
          </button>
        </div>
      </div>

      {/* TOP SELECTOR (Mobile only) — compact header with pill switcher */}
      <div className="md:hidden flex items-center justify-between gap-2 px-4 py-3 border-b border-[#EBE3D5] bg-[#FCFAF6] shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {shopLogoUrl ? (
            <img src={shopLogoUrl} alt="Logo" className="h-7 w-7 object-contain rounded-lg shrink-0" referrerPolicy="no-referrer" />
          ) : (
            <div className="h-7 w-7 bg-[#922B50] text-white rounded-lg flex items-center justify-center font-black text-[10px] shrink-0">WP</div>
          )}
          <p className="text-[8.5px] text-[#8F7080] uppercase font-black tracking-widest truncate">Back Office</p>
        </div>

        <div className="flex items-center bg-white border border-zinc-200 rounded-full p-1 gap-1 shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveSidebar('shop');
              setAdminError('');
              setAdminSuccess('');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
              activeSidebar === 'shop'
                ? 'bg-[#4E3D30] text-white shadow-xs'
                : 'text-[#8F7080]'
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5 shrink-0" />
            Shop
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveSidebar('settings');
              setAdminError('');
              setAdminSuccess('');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
              activeSidebar === 'settings'
                ? 'bg-[#4E3D30] text-white shadow-xs'
                : 'text-[#8F7080]'
            }`}
          >
            <Settings className="h-3.5 w-3.5 shrink-0" />
            Settings
          </button>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Exit Back Office"
            className="h-8 w-8 shrink-0 flex items-center justify-center rounded-full bg-rose-50 text-rose-600 border border-rose-100 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* FIXED SIGN OUT BAR (Mobile only) */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#EBE3D5] px-4 py-2 flex items-center justify-center"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      >
        <button
          type="button"
          onClick={() => {
            setIsAdminAuthenticated(false);
            setAdminPasswordInput('');
            localStorage.removeItem('admin_session_auth');
            setAdminSuccess('Signed out of administrative session.');
          }}
          className="flex items-center gap-1.5 text-[10px] font-black uppercase text-zinc-400 tracking-widest hover:text-zinc-600 py-1 cursor-pointer"
        >
          <LogOut className="h-3 w-3" />
          Sign Out of Session
        </button>
      </div>

      {/* WORKSPACE AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#FCFAF6] overflow-hidden pb-12 md:pb-0">
        
        {/* WORKSPACE CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          
          {/* Header row with Serif title and top-right pill switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#EBE3D5]/40">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-[#2E1B26]">
                {activeSidebar === 'shop' ? (
                  activeShopTab === 'fabrics' ? 'Fabrics' :
                  activeShopTab === 'pads' ? 'Ready-Made Pads' :
                  activeShopTab === 'pricing' ? 'Pricing & Sizes' :
                  activeShopTab === 'faq' ? 'FAQ Board' :
                  activeShopTab === 'blog' ? 'Blog Posts' :
                  activeShopTab === 'feedback' ? 'Customer Feedback' : 'Shop Categories'
                ) : (
                  activeSettingsTab === 'routing' ? 'Store Routing & Password' :
                  activeSettingsTab === 'publishing' ? 'GitHub Sync' :
                  activeSettingsTab === 'database' ? 'Backups & Diagnostics' : 'Danger Zone'
                )}
              </h1>
            </div>

            {/* Pills layout next to header */}
            {activeSidebar === 'shop' ? (
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'fabrics', label: 'Fabrics' },
                  { id: 'pads', label: 'Ready-Made Pads' },
                  { id: 'pricing', label: 'Pricing' },
                  { id: 'faq', label: 'FAQ' },
                  { id: 'blog', label: 'Blog' },
                  { id: 'categories', label: 'Categories' },
                  { id: 'feedback', label: '💬 Feedback' }
                ].map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setActiveShopTab(t.id as any);
                      setAdminError('');
                      setAdminSuccess('');
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                      activeShopTab === t.id
                        ? 'bg-[#4E3D30] text-white border-transparent shadow-xs'
                        : 'bg-white text-[#4E3E3B] border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'routing', label: 'Routing & Secret' },
                  { id: 'publishing', label: 'GitHub Sync' },
                  { id: 'database', label: 'Backups' },
                  { id: 'danger', label: 'Danger Zone' }
                ].map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setActiveSettingsTab(t.id as any);
                      setAdminError('');
                      setAdminSuccess('');
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                      activeSettingsTab === t.id
                        ? 'bg-[#4E3D30] text-white border-transparent shadow-xs'
                        : 'bg-white text-[#4E3E3B] border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Feedback alerts inline */}
          {(adminSuccess || adminError) && (
            <div className="flex items-center gap-2">
              {adminSuccess && (
                <div className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-lg animate-fadeIn flex items-center gap-1.5">
                  <Check className="h-3 w-3" />
                  <span>{adminSuccess}</span>
                </div>
              )}
              {adminError && (
                <div className="text-[10px] font-semibold text-rose-800 bg-rose-50 border border-rose-100 px-3 py-2 rounded-lg animate-fadeIn flex items-center gap-1.5">
                  <AlertTriangle className="h-3 w-3" />
                  <span>{adminError}</span>
                </div>
              )}
            </div>
          )}
          
          {/* SHOP MANAGEMENT VIEW CONTAINER */}
          {activeSidebar === 'shop' && (
            <div className="space-y-6">
              
              {/* TAB 1: FABRICS SECTION */}
              {activeShopTab === 'fabrics' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="relative w-full max-w-xs">
                      <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                      <input
                        type="text"
                        placeholder="Search fabrics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-xs border border-zinc-250 bg-white rounded-xl focus:outline-none focus:bg-zinc-50 font-sans"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowFabricAdvancedImport(!showFabricAdvancedImport)}
                        className="bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-600 font-extrabold text-[11px] uppercase tracking-wider px-3.5 py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        🎨 Bulk Fabric Import
                      </button>
                      <button
                        type="button"
                        onClick={() => openFabricModal(null)}
                        className="bg-zinc-900 hover:bg-zinc-850 text-white font-extrabold text-[11px] uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Fabric Print</span>
                      </button>
                    </div>
                  </div>

                  {/* Collapsible fabric bulk import section */}
                  {showFabricAdvancedImport && (
                    <div className="bg-zinc-100 p-4 rounded-2xl border border-zinc-200 space-y-3 shadow-inner text-left max-w-lg animate-fadeIn">
                      <h4 className="text-[11px] font-black uppercase text-zinc-800 tracking-wider">🎨 Bulk Create Fabrics from Lookbook Photos</h4>
                      <p className="text-[10px] text-zinc-500 leading-normal">
                        Type in a search keyword matching files in your R2 photo lookbook, preview the matches, choose a category, then confirm to batch-create fabric prints.
                      </p>

                      {/* Top vs Backing toggle */}
                      <div className="flex items-center gap-1 bg-white border border-zinc-200 rounded-lg p-1 w-fit">
                        <button
                          type="button"
                          onClick={() => { setFabricBulkType('top'); setFabricBulkPreview(null); }}
                          className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                            fabricBulkType === 'top' ? 'bg-zinc-900 text-white' : 'text-zinc-500'
                          }`}
                        >
                          Top / Print
                        </button>
                        <button
                          type="button"
                          onClick={() => { setFabricBulkType('backing'); setFabricBulkPreview(null); }}
                          className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                            fabricBulkType === 'backing' ? 'bg-zinc-900 text-white' : 'text-zinc-500'
                          }`}
                        >
                          Backing
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Filename keyword (e.g., flowers)"
                          value={fabricBulkImportTag}
                          onChange={(e) => { setFabricBulkImportTag(e.target.value); setFabricBulkPreview(null); }}
                          className="flex-1 p-2 text-xs border border-zinc-250 rounded-lg bg-white"
                        />
                        <button
                          type="button"
                          disabled={isFabricBulkImporting}
                          onClick={handlePreviewFabricBulkImport}
                          className="bg-[#7D8F7D] text-white px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap"
                        >
                          {isFabricBulkImporting ? 'Searching...' : '🔍 Preview Matches'}
                        </button>
                      </div>

                      {fabricBulkPreview && fabricBulkPreview.length > 0 && (
                        <div className="space-y-3 pt-2 border-t border-zinc-200">
                          <p className="text-[10px] font-black text-zinc-700 uppercase tracking-wider">
                            Found {fabricBulkPreview.length} matching photo{fabricBulkPreview.length !== 1 ? 's' : ''} — review before importing as {fabricBulkType === 'backing' ? 'backing fabrics' : 'top/print fabrics'}:
                          </p>
                          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1">
                            {fabricBulkPreview.map((p: any, i: number) => (
                              <div key={i} className="space-y-1">
                                <div className="aspect-square rounded-lg overflow-hidden bg-white border border-zinc-200">
                                  <img src={p.url} alt={p.filename} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                                </div>
                                <p className="text-[7.5px] text-zinc-500 truncate" title={p.filename}>{p.filename.split('.')[0].replace(/[-_]+/g, ' ')}</p>
                              </div>
                            ))}
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            {fabricBulkType === 'top' && (
                              <div className="space-y-1">
                                <label className="text-[9px] text-zinc-450 font-black uppercase">Category to assign</label>
                                <select
                                  value={fabricBulkCategory || categories[0] || ''}
                                  onChange={(e) => setFabricBulkCategory(e.target.value)}
                                  className="w-full p-2 text-xs border border-zinc-250 rounded-lg bg-white"
                                >
                                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                              </div>
                            )}
                            <div className="space-y-1">
                              <label className="text-[9px] text-zinc-450 font-black uppercase">Material</label>
                              <input
                                type="text"
                                value={fabricBulkMaterial}
                                onChange={(e) => setFabricBulkMaterial(e.target.value)}
                                className="w-full p-2 text-xs border border-zinc-250 rounded-lg bg-white"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2 justify-end">
                            <button
                              type="button"
                              onClick={() => { setFabricBulkPreview(null); }}
                              className="text-[10px] font-bold text-zinc-500 px-3 py-2 hover:underline"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleConfirmFabricBulkImport}
                              className="bg-zinc-900 hover:bg-zinc-850 text-white px-4 py-2 rounded-lg text-xs font-bold"
                            >
                              ✅ Confirm & Import {fabricBulkPreview.length} Fabric{fabricBulkPreview.length !== 1 ? 's' : ''}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Visual collapsible sections by categories */}
                  <div className="space-y-4">
                    {Object.entries(fabricsByCategory).map(([catName, list]) => {
                      // Apply search filter if active
                      const filteredList = list.filter(f => 
                        f.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                        (f.material || '').toLowerCase().includes(searchQuery.toLowerCase().trim())
                      );

                      if (searchQuery.trim() && filteredList.length === 0) return null;

                      const isCollapsed = !!collapsedCategories[catName];
                      const totalCount = list.length;

                      return (
                        <div key={catName} className="transition-all">
                          {/* Accordion header (Styled like the picture's rounded beige bar) */}
                          <button
                            type="button"
                            onClick={() => toggleCategory(catName)}
                            className="w-full flex items-center justify-between px-5 py-3.5 bg-[#F5EDE0] text-[#5E4E4A] hover:bg-[#EBE3D5] rounded-full cursor-pointer select-none transition-colors mb-3"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-xs font-bold uppercase tracking-wider text-[#2E1B26]">{catName}</span>
                              <span className="text-[9.5px] font-bold text-amber-800 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full font-mono">
                                {totalCount} prints
                              </span>
                            </div>
                            {isCollapsed ? <ChevronDown className="h-4 w-4 text-zinc-500" /> : <ChevronUp className="h-4 w-4 text-zinc-500" />}
                          </button>

                          {/* Grid of Visual cards */}
                          {!isCollapsed && (
                            <div className="p-1 pb-6 bg-transparent">
                              {filteredList.length === 0 ? (
                                <p className="text-xs text-center py-6 text-zinc-400 font-bold">No prints found matching keyword</p>
                              ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                  {filteredList.map((fab) => (
                                    <div key={fab.id} className="group relative overflow-hidden bg-white border border-zinc-200 rounded-2xl shadow-3xs hover:border-zinc-350 hover:shadow-2xs transition-all flex flex-col">
                                      {/* Image Swatch */}
                                      <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 border-b border-zinc-100 flex items-center justify-center">
                                        {fab.imageUrl ? (
                                          <img src={fab.imageUrl} alt={fab.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" referrerPolicy="no-referrer" />
                                        ) : (
                                          <div className="text-3xl text-zinc-300 font-bold">🧵</div>
                                        )}
                                        {fab.hidden && (
                                          <span className="absolute top-1.5 right-1.5 bg-zinc-800/80 text-white text-[7.5px] font-black uppercase px-1.5 py-0.5 rounded-full tracking-widest">Hidden</span>
                                        )}
                                      </div>

                                      {/* Info */}
                                      <div className="p-2.5 text-left flex-1 flex flex-col justify-between">
                                        <div>
                                          <h5 className="font-bold text-[10.5px] text-zinc-800 truncate" title={fab.name}>{fab.name}</h5>
                                          <p className="text-[9px] text-zinc-450 mt-0.5">{fab.material || 'Cotton Woven'}</p>
                                        </div>

                                        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-zinc-100">
                                          <span className="text-[8.5px] font-black uppercase tracking-wider text-zinc-400">
                                            {fab.premium > 0 ? `+S$${fab.premium.toFixed(2)}` : 'Standard'}
                                          </span>
                                          <span className={`text-[8.5px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0 ${
                                            fab.stockStatus === 'out_of_stock' ? 'bg-rose-50 text-rose-600' :
                                            fab.stockStatus === 'low_stock' ? 'bg-amber-50 text-amber-600' :
                                            'bg-emerald-50 text-emerald-600'
                                          }`}>
                                            {fab.stockStatus === 'out_of_stock' ? 'Out' :
                                             fab.stockStatus === 'low_stock' ? 'Low' : 'In Stock'}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Hover Action Overlay Overlay */}
                                      <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-3xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                                        <button
                                          type="button"
                                          onClick={() => openFabricModal(fab)}
                                          className="bg-white hover:bg-zinc-50 text-zinc-800 font-extrabold text-[10px] p-2 rounded-xl transition-all shadow-3xs flex items-center gap-1 cursor-pointer"
                                        >
                                          <Edit className="h-3 w-3" /> Edit
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteFabric(fab)}
                                          className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[10px] p-2 rounded-xl transition-all shadow-3xs flex items-center gap-1 cursor-pointer"
                                        >
                                          <Trash2 className="h-3 w-3" /> Delete
                                        </button>
                                      </div>

                                      {/* Mobile-only visible action buttons below */}
                                      <div className="md:hidden grid grid-cols-2 border-t border-zinc-100">
                                        <button
                                          type="button"
                                          onClick={() => openFabricModal(fab)}
                                          className="flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold text-zinc-700 bg-zinc-50 active:bg-zinc-200 border-r border-zinc-100 cursor-pointer"
                                        >
                                          <Edit className="h-3.5 w-3.5" /> Edit
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteFabric(fab)}
                                          className="flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold text-rose-600 bg-rose-50 active:bg-rose-200 cursor-pointer"
                                        >
                                          <Trash2 className="h-3.5 w-3.5" /> Delete
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: READY-MADE RTS PADS */}
              {activeShopTab === 'pads' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="relative w-full max-w-xs">
                      <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                      <input
                        type="text"
                        placeholder="Search ready-made pads..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-xs border border-zinc-250 bg-white rounded-xl focus:outline-none focus:bg-zinc-50 font-sans"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAdvancedImport(!showAdvancedImport)}
                        className="bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-600 font-extrabold text-[11px] uppercase tracking-wider px-3.5 py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        🚀 Bulk Lookbook Import
                      </button>
                      <button
                        type="button"
                        onClick={() => openRtsModal(null)}
                        className="bg-zinc-900 hover:bg-zinc-850 text-white font-extrabold text-[11px] uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Ready-Made Pad</span>
                      </button>
                    </div>
                  </div>

                  {/* Collapsible bulk import section */}
                  {showAdvancedImport && (
                    <div className="bg-zinc-100 p-4 rounded-2xl border border-zinc-200 space-y-3 shadow-inner text-left max-w-lg animate-fadeIn">
                      <h4 className="text-[11px] font-black uppercase text-zinc-800 tracking-wider">📦 Bulk Create from Lookbook Photos</h4>
                      <p className="text-[10px] text-zinc-500 leading-normal">
                        Type in a search keyword (like "kimmi", "pads", or "flowers") matching files in your R2 photo lookbook, preview the matches, then choose size/absorbency/price before confirming.
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Filename keyword (e.g., flowers)"
                          value={rtsBulkImportTag}
                          onChange={(e) => { setRtsBulkImportTag(e.target.value); setRtsBulkPreview(null); }}
                          className="flex-1 p-2 text-xs border border-zinc-250 rounded-lg bg-white"
                        />
                        <button
                          type="button"
                          disabled={isRtsBulkImporting}
                          onClick={async () => {
                            if (!rtsBulkImportTag.trim()) return;
                            try {
                              setIsRtsBulkImporting(true);
                              const response = await fetch('/api/lookbook-photos');
                              if (response.ok) {
                                const data = await response.json();
                                const photos = (data.photos || []).map((ph: any) => ({
                                  filename: ph.filename, url: ph.secure_url
                                }));
                                const filtered = photos.filter((p: any) => p.filename.toLowerCase().includes(rtsBulkImportTag.toLowerCase().trim()));
                                if (filtered.length === 0) {
                                  alert(`No photos found matching folder keyword "${rtsBulkImportTag}".`);
                                  setRtsBulkPreview(null);
                                } else {
                                  setRtsBulkPreview(filtered);
                                }
                              }
                            } catch (err: any) {
                              setAdminError('Preview failed: ' + err.message);
                            } finally {
                              setIsRtsBulkImporting(false);
                            }
                          }}
                          className="bg-[#7D8F7D] text-white px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap"
                        >
                          {isRtsBulkImporting ? 'Searching...' : '🔍 Preview Matches'}
                        </button>
                      </div>

                      {rtsBulkPreview && rtsBulkPreview.length > 0 && (
                        <div className="space-y-3 pt-2 border-t border-zinc-200">
                          <p className="text-[10px] font-black text-zinc-700 uppercase tracking-wider">
                            Found {rtsBulkPreview.length} matching photo{rtsBulkPreview.length !== 1 ? 's' : ''} — review before importing:
                          </p>
                          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1">
                            {rtsBulkPreview.map((p: any, i: number) => (
                              <div key={i} className="space-y-1">
                                <div className="aspect-square rounded-lg overflow-hidden bg-white border border-zinc-200">
                                  <img src={p.url} alt={p.filename} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                                </div>
                                <p className="text-[7.5px] text-zinc-500 truncate" title={p.filename}>{p.filename.split('.')[0].replace(/[-_]+/g, ' ')}</p>
                              </div>
                            ))}
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="text-[9px] text-zinc-450 font-black uppercase">Absorbency to assign</label>
                              <select
                                value={rtsBulkAbsorbency}
                                onChange={(e) => setRtsBulkAbsorbency(e.target.value)}
                                className="w-full p-2 text-xs border border-zinc-250 rounded-lg bg-white"
                              >
                                <option value="Liner">Liner</option>
                                <option value="Light">Light</option>
                                <option value="Moderate dry">Moderate</option>
                                <option value="Heavy dry">Heavy</option>
                                <option value="Extra Long">Extra Long</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] text-zinc-450 font-black uppercase">Size to assign</label>
                              <select
                                value={rtsBulkSize}
                                onChange={(e) => setRtsBulkSize(e.target.value)}
                                className="w-full p-2 text-xs border border-zinc-250 rounded-lg bg-white"
                              >
                                {sizeOptions.map(opt => (
                                  <option key={opt.id} value={opt.displayLabel || opt.name}>{opt.displayLabel || opt.name}</option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-1 col-span-2">
                              <label className="text-[9px] text-zinc-450 font-black uppercase">Price (S$) to assign</label>
                              <input
                                type="number"
                                value={rtsBulkPrice}
                                onChange={(e) => setRtsBulkPrice(e.target.value)}
                                className="w-full p-2 text-xs border border-zinc-250 rounded-lg bg-white font-mono"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2 justify-end">
                            <button
                              type="button"
                              onClick={() => { setRtsBulkPreview(null); }}
                              className="text-[10px] font-bold text-zinc-500 px-3 py-2 hover:underline"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                const importedPads = rtsBulkPreview.map((p: any, index: number) => ({
                                  id: 'rts-' + Date.now() + '-' + index,
                                  name: RTS_NAME_MAP[rtsBulkAbsorbency] || rtsBulkAbsorbency,
                                  description: 'Pre-crafted limited release pack ready for immediate dispatch',
                                  price: parseFloat(rtsBulkPrice) || 15.00,
                                  quantityLeft: 1,
                                  size: rtsBulkSize,
                                  sizeLabel: rtsBulkSize,
                                  print: p.filename.split('.')[0].replace(/[-_]+/g, ' '),
                                  printLabel: p.filename.split('.')[0].replace(/[-_]+/g, ' '),
                                  absorbency: rtsBulkAbsorbency,
                                  absorbencyLabel: rtsBulkAbsorbency,
                                  imageUrl: p.url,
                                  adminNotes: 'Bulk imported from lookbook folder',
                                  shape: '',
                                  hidden: false
                                }));

                                const newList = [...readyMadeStocks, ...importedPads];
                                setReadyMadeStocks(newList);
                                const success = await saveDatabase({ readyMadeStocks: newList });
                                if (success) {
                                  setAdminSuccess(`Successfully bulk-imported ${importedPads.length} ready-made pads into "${rtsBulkAbsorbency}"!`);
                                  setShowAdvancedImport(false);
                                  setRtsBulkPreview(null);
                                }
                              }}
                              className="bg-zinc-900 hover:bg-zinc-850 text-white px-4 py-2 rounded-lg text-xs font-bold"
                            >
                              ✅ Confirm & Import {rtsBulkPreview.length} Pad{rtsBulkPreview.length !== 1 ? 's' : ''}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* RTS Visual grids by categories */}
                  <div className="space-y-4">
                    {Object.entries(rtsByCategory).map(([catName, list]) => {
                      const filteredList = list.filter(item => 
                        (item.print || '').toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                        (item.name || '').toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                        (item.size || '').toLowerCase().includes(searchQuery.toLowerCase().trim())
                      );

                      if (searchQuery.trim() && filteredList.length === 0) return null;

                      const isCollapsed = !!collapsedCategories['rts-' + catName];
                      const totalCount = list.length;

                      return (
                        <div key={catName} className="transition-all">
                          <button
                            type="button"
                            onClick={() => toggleCategory('rts-' + catName)}
                            className="w-full flex items-center justify-between px-5 py-3.5 bg-[#F5EDE0] text-[#5E4E4A] hover:bg-[#EBE3D5] rounded-full cursor-pointer select-none transition-colors mb-3"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-xs font-bold uppercase tracking-wider text-[#2E1B26]">{catName} Category</span>
                              <span className="text-[9.5px] font-bold text-amber-800 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full font-mono">
                                {totalCount} in catalog
                              </span>
                            </div>
                            {isCollapsed ? <ChevronDown className="h-4 w-4 text-zinc-500" /> : <ChevronUp className="h-4 w-4 text-zinc-500" />}
                          </button>

                          {!isCollapsed && (
                            <div className="p-1 pb-6 bg-transparent">
                              {filteredList.length === 0 ? (
                                <p className="text-xs text-center py-6 text-zinc-400 font-bold">No ready stock in this category</p>
                              ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                  {filteredList.map((item) => (
                                    <div key={item.id} className="group relative overflow-hidden bg-white border border-zinc-200 rounded-2xl shadow-3xs hover:border-zinc-350 hover:shadow-2xs transition-all flex flex-col">
                                      
                                      {/* Image container */}
                                      <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 border-b border-zinc-100 flex items-center justify-center">
                                        {item.imageUrl ? (
                                          <img src={item.imageUrl} alt={item.print} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" referrerPolicy="no-referrer" />
                                        ) : (
                                          <div className="text-3xl">📦</div>
                                        )}
                                        {item.hidden && (
                                          <span className="absolute top-1.5 right-1.5 bg-zinc-800/80 text-white text-[7.5px] font-black uppercase px-1.5 py-0.5 rounded-full tracking-widest">Hidden</span>
                                        )}
                                        {/* Elegant Pad Shape Badge Overlay */}
                                        {item.shape && (
                                          <span className="absolute bottom-1.5 left-1.5 bg-zinc-900/90 text-white text-[8px] font-black px-2 py-0.5 rounded-full tracking-wide animate-fadeIn">
                                            {SHAPE_LABELS[item.shape] || item.shape}
                                          </span>
                                        )}
                                      </div>

                                      {/* RTS Info */}
                                      <div className="p-2.5 text-left flex-1 flex flex-col justify-between space-y-1">
                                        <div>
                                          <h5 className="font-bold text-[10.5px] text-zinc-800 truncate" title={item.print || item.name}>
                                            {item.print || 'Ready Release Pad'}
                                          </h5>
                                          <p className="text-[9px] text-zinc-550 leading-normal">
                                            Size: {item.size || '8 inch'} • {item.absorbency || 'Moderate'}
                                          </p>
                                          {item.shape && (
                                            <p className="text-[9px] text-[#922B50] font-bold leading-normal mt-0.5">
                                              Shape: {SHAPE_LABELS[item.shape] || item.shape}
                                            </p>
                                          )}
                                        </div>

                                        <div className="flex items-center justify-between pt-1.5 border-t border-zinc-100 mt-2">
                                          <span className="text-[11.5px] font-mono font-black text-zinc-800">S${(item.price || 15.00).toFixed(2)}</span>
                                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full shrink-0 ${
                                            (item.quantityLeft || 0) === 0 ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                                          }`}>
                                            {item.quantityLeft || 0} left
                                          </span>
                                        </div>
                                      </div>

                                      {/* Hover Action Overlay Overlay */}
                                      <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-3xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                                        <button
                                          type="button"
                                          onClick={() => openRtsModal(item)}
                                          className="bg-white hover:bg-zinc-50 text-zinc-800 font-extrabold text-[10px] p-2 rounded-xl transition-all shadow-3xs flex items-center gap-1 cursor-pointer"
                                        >
                                          <Edit className="h-3 w-3" /> Edit
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteRts(item)}
                                          className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[10px] p-2 rounded-xl transition-all shadow-3xs flex items-center gap-1 cursor-pointer"
                                        >
                                          <Trash2 className="h-3 w-3" /> Delete
                                        </button>
                                      </div>

                                      {/* Mobile overlay controls */}
                                      <div className="md:hidden grid grid-cols-2 border-t border-zinc-100">
                                        <button
                                          type="button"
                                          onClick={() => openRtsModal(item)}
                                          className="flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold text-zinc-700 bg-zinc-50 active:bg-zinc-200 border-r border-zinc-100 cursor-pointer"
                                        >
                                          <Edit className="h-3.5 w-3.5" /> Edit
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteRts(item)}
                                          className="flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold text-rose-600 bg-rose-50 active:bg-rose-200 cursor-pointer"
                                        >
                                          <Trash2 className="h-3.5 w-3.5" /> Delete
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: PAD SIZES & PRICING TABLE */}
              {activeShopTab === 'pricing' && (
                <div className="space-y-5 text-left">
                  <div className="flex justify-between items-center pb-2">
                    <div>
                      <h4 className="text-[11.5px] font-black uppercase text-zinc-500 tracking-wider">📏 Pad Sizes &amp; Pricing Management</h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed">Configure sizing length options, base retail price, backing material upgrades, and additional absorption layer add-ons.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddingSize(true)}
                      className="bg-zinc-900 hover:bg-zinc-850 text-white font-extrabold text-[10.5px] px-3.5 py-2 rounded-xl uppercase tracking-wider cursor-pointer inline-flex items-center gap-1.5 shadow-3xs active:scale-97 transition-all"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Pad Size</span>
                    </button>
                  </div>

                  {/* Clean responsive pricing list table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse font-sans text-xs min-w-[700px]">
                      <thead>
                        <tr className="text-[10px] uppercase font-bold tracking-wider text-[#5E4E4A] bg-[#F5EDE0]">
                          <th className="py-3 px-4 first:rounded-l-full last:rounded-r-full first:pl-6 last:pr-6">Size ID</th>
                          <th className="py-3 px-4 first:rounded-l-full last:rounded-r-full first:pl-6 last:pr-6">Display Label</th>
                          <th className="py-3 px-4 first:rounded-l-full last:rounded-r-full first:pl-6 last:pr-6">Length (Inches)</th>
                          <th className="py-3 px-4 first:rounded-l-full last:rounded-r-full first:pl-6 last:pr-6 font-mono text-right">Base Price (SGD)</th>
                          <th className="py-3 px-4 first:rounded-l-full last:rounded-r-full first:pl-6 last:pr-6 font-mono text-right">Backing Upgrade (SGD)</th>
                          <th className="py-3 px-4 first:rounded-l-full last:rounded-r-full first:pl-6 last:pr-6 font-mono text-right">Additional Layer Upgrade (SGD)</th>
                          <th className="py-3 px-4 first:rounded-l-full last:rounded-r-full first:pl-6 last:pr-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200/60">
                        {/* Adding inline row if active */}
                        {isAddingSize && (
                          <tr className="bg-amber-50/50 border-b border-amber-100 font-medium">
                            <td className="py-2.5 px-3">
                              <input
                                type="text"
                                placeholder="liner, night_heavy"
                                value={addSizeId}
                                onChange={(e) => setAddSizeId(e.target.value)}
                                className="w-full p-1.5 border border-zinc-300 rounded-lg bg-white font-mono text-xs focus:ring-1 focus:ring-zinc-400 focus:outline-none"
                              />
                            </td>
                            <td className="py-2.5 px-3">
                              <input
                                type="text"
                                placeholder="Liner (6 inch)"
                                value={addSizeLabel}
                                onChange={(e) => setAddSizeLabel(e.target.value)}
                                className="w-full p-1.5 border border-zinc-300 rounded-lg bg-white text-xs focus:outline-none"
                              />
                            </td>
                            <td className="py-2.5 px-3">
                              <input
                                type="number"
                                placeholder="8"
                                value={addSizeLength}
                                onChange={(e) => setAddSizeLength(e.target.value)}
                                className="w-full p-1.5 border border-zinc-300 rounded-lg bg-white text-xs focus:outline-none"
                              />
                            </td>
                            <td className="py-2.5 px-3">
                              <input
                                type="number"
                                step="0.50"
                                value={addSizePrice}
                                onChange={(e) => setAddSizePrice(e.target.value)}
                                className="w-full p-1.5 border border-zinc-300 rounded-lg bg-white font-mono text-xs text-right focus:outline-none"
                              />
                            </td>
                            <td className="py-2.5 px-3">
                              <input
                                type="number"
                                step="0.10"
                                value={addSizeBackingUpgrade}
                                onChange={(e) => setAddSizeBackingUpgrade(e.target.value)}
                                className="w-full p-1.5 border border-zinc-300 rounded-lg bg-white font-mono text-xs text-right focus:outline-none"
                              />
                            </td>
                            <td className="py-2.5 px-3">
                              <input
                                type="number"
                                step="0.10"
                                value={addSizeLayerUpgrade}
                                onChange={(e) => setAddSizeLayerUpgrade(e.target.value)}
                                className="w-full p-1.5 border border-zinc-300 rounded-lg bg-white font-mono text-xs text-right focus:outline-none"
                              />
                            </td>
                            <td className="py-2.5 px-3 text-right space-x-1.5 shrink-0 whitespace-nowrap">
                              <button
                                type="button"
                                onClick={handleAddSizeInline}
                                className="bg-emerald-600 text-white font-extrabold text-[10px] px-2.5 py-1.5 rounded-lg hover:bg-emerald-700"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setIsAddingSize(false)}
                                className="bg-zinc-200 text-zinc-700 font-extrabold text-[10px] px-2.5 py-1.5 rounded-lg hover:bg-zinc-250"
                              >
                                Cancel
                              </button>
                            </td>
                          </tr>
                        )}

                        {/* Rendering the lists */}
                        {sizeOptions.map((sz) => {
                          const isEditingRow = editingSizeId === sz.id;
                          return (
                            <tr key={sz.id} className={`hover:bg-zinc-50/50 ${isEditingRow ? 'bg-zinc-50' : ''}`}>
                              <td className="py-3 px-3 font-mono text-xs text-zinc-550 font-semibold">{sz.id}</td>
                              <td className="py-3 px-3 font-bold text-zinc-800">
                                {isEditingRow ? (
                                  <input
                                    type="text"
                                    value={inlineLabel}
                                    onChange={(e) => setInlineLabel(e.target.value)}
                                    className="p-1 border border-zinc-300 rounded-md bg-white text-xs w-full focus:outline-none"
                                  />
                                ) : (
                                  sz.displayLabel || sz.name
                                )}
                              </td>
                              <td className="py-3 px-3">
                                {isEditingRow ? (
                                  <input
                                    type="number"
                                    value={inlineLength}
                                    onChange={(e) => setInlineLength(e.target.value)}
                                    className="p-1 border border-zinc-300 rounded-md bg-white text-xs w-20 focus:outline-none"
                                  />
                                ) : (
                                  `${sz.lengthInches || 8} inch`
                                )}
                              </td>
                              <td className="py-3 px-3 font-mono text-right font-extrabold text-zinc-700">
                                {isEditingRow ? (
                                  <input
                                    type="number"
                                    step="0.1"
                                    value={inlinePrice}
                                    onChange={(e) => setInlinePrice(e.target.value)}
                                    className="p-1 border border-zinc-300 rounded-md bg-white text-xs font-mono w-24 text-right focus:outline-none"
                                  />
                                ) : (
                                  `S$${(sz.basePrice || sz.priceBase || 11.00).toFixed(2)}`
                                )}
                              </td>
                              <td className="py-3 px-3 font-mono text-right text-zinc-650">
                                {isEditingRow ? (
                                  <input
                                    type="number"
                                    step="0.1"
                                    value={inlineBackingUpgrade}
                                    onChange={(e) => setInlineBackingUpgrade(e.target.value)}
                                    className="p-1 border border-zinc-300 rounded-md bg-white text-xs font-mono w-24 text-right focus:outline-none"
                                  />
                                ) : (
                                  `S$${(sz.backingUpgrade || 0).toFixed(2)}`
                                )}
                              </td>
                              <td className="py-3 px-3 font-mono text-right text-zinc-650">
                                {isEditingRow ? (
                                  <input
                                    type="number"
                                    step="0.1"
                                    value={inlineLayerUpgrade}
                                    onChange={(e) => setInlineLayerUpgrade(e.target.value)}
                                    className="p-1 border border-zinc-300 rounded-md bg-white text-xs font-mono w-24 text-right focus:outline-none"
                                  />
                                ) : (
                                  `S$${(sz.layerUpgrade || sz.additionalLayerUpgrade || 0).toFixed(2)}`
                                )}
                              </td>
                              <td className="py-3 px-3 text-right">
                                {isEditingRow ? (
                                  <div className="flex justify-end gap-1">
                                    <button
                                      type="button"
                                      onClick={() => saveInlineEdit(sz.id)}
                                      className="bg-zinc-900 text-white hover:bg-zinc-800 text-[10px] font-black px-2.5 py-1.5 rounded-lg"
                                    >
                                      Save
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setEditingSizeId(null)}
                                      className="bg-zinc-150 hover:bg-zinc-200 text-zinc-600 text-[10px] font-black px-2.5 py-1.5 rounded-lg"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex justify-end gap-1">
                                    <button
                                      type="button"
                                      onClick={() => startInlineEdit(sz)}
                                      className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[10px] font-bold px-2 py-1 rounded-lg cursor-pointer"
                                    >
                                      ✏️ Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteSizeOption(sz)}
                                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-1 rounded-lg cursor-pointer"
                                    >
                                      🗑️ Delete
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: FAQ QUESTIONS LIST */}
              {activeShopTab === 'faq' && (
                <div className="space-y-4 bg-white border border-zinc-200 rounded-3xl p-5 shadow-3xs text-left">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
                    <div>
                      <h4 className="text-[11.5px] font-black uppercase text-zinc-800 tracking-wider">❓ Administrative FAQ Manager</h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed">Publish and keep customer-facing washing, prep care, or fabric guide instructions updated.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openFaqModal(null)}
                      className="bg-zinc-900 hover:bg-zinc-850 text-white font-extrabold text-[10.5px] px-3.5 py-2 rounded-xl uppercase tracking-wider cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add New FAQ</span>
                    </button>
                  </div>

                  <div className="space-y-3 divide-y divide-zinc-100">
                    {washingFaq.length === 0 ? (
                      <p className="text-xs text-center py-6 text-zinc-400">No FAQ questions published yet.</p>
                    ) : (
                      washingFaq.map((faq, idx) => (
                        <div key={idx} className="pt-3 flex justify-between gap-4 items-start hover:bg-zinc-50/50 p-2 rounded-xl transition-all">
                          <div className="space-y-1">
                            <h5 className="font-bold text-[11.5px] text-zinc-800">Q: {faq.question}</h5>
                            <p className="text-[10px] text-zinc-550 leading-relaxed">A: {faq.answer}</p>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => openFaqModal(faq)}
                              className="bg-zinc-100 text-zinc-700 text-[10px] font-bold px-2.5 py-1 rounded-lg"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteFaq(faq)}
                              className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2.5 py-1 rounded-lg"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: BLOG PUBLISHING MANAGER */}
              {activeShopTab === 'blog' && (
                <div className="space-y-4 bg-white border border-zinc-200 rounded-3xl p-5 shadow-3xs text-left">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
                    <div>
                      <h4 className="text-[11.5px] font-black uppercase text-zinc-800 tracking-wider">📝 Educational Blog Posts</h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed">Publish cycles, reusable pad articles, and store announcements to customers.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openBlogModal(null)}
                      className="bg-zinc-900 hover:bg-zinc-850 text-white font-extrabold text-[10.5px] px-3.5 py-2 rounded-xl uppercase tracking-wider cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Write Article</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {blogPosts.length === 0 ? (
                      <p className="text-xs text-center py-6 text-zinc-400 col-span-full">No articles written yet.</p>
                    ) : (
                      blogPosts.map((post) => (
                        <div key={post.id} className="border border-zinc-200 bg-zinc-50/50 rounded-2xl overflow-hidden shadow-3xs hover:shadow-2xs transition-all flex flex-col justify-between">
                          <div className="relative h-32 bg-zinc-200">
                            {post.imageUrl && (
                              <img src={post.imageUrl} alt={post.title} className="h-full w-full object-cover" />
                            )}
                            <div className="absolute top-2 left-2 bg-zinc-900/85 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full">
                              By {post.author || 'WonderPads'}
                            </div>
                          </div>
                          <div className="p-3 text-left space-y-1.5 flex-1 flex flex-col justify-between">
                            <div>
                              <h5 className="font-extrabold text-[11px] text-zinc-800 line-clamp-1">{post.title}</h5>
                              <p className="text-[9.5px] text-zinc-500 line-clamp-3 leading-relaxed mt-1">
                                {post.content}
                              </p>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-zinc-150 mt-3">
                              <span className="text-[8.5px] font-mono font-bold text-zinc-400">{post.date}</span>
                              <div className="flex gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => openBlogModal(post)}
                                  className="text-[9.5px] font-bold text-zinc-700 hover:underline"
                                >
                                  ✏️ Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteBlog(post)}
                                  className="text-[9.5px] font-bold text-rose-600 hover:underline"
                                >
                                  🗑️ Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 6: SHOP CATEGORIES (IN SHOP LEVEL) */}
              {activeShopTab === 'categories' && (
                <div className="space-y-4 bg-white border border-zinc-200 rounded-3xl p-5 shadow-3xs text-left max-w-xl">
                  <div>
                    <h4 className="text-[11.5px] font-black uppercase text-zinc-800 tracking-wider">📂 Edit Shop Categories</h4>
                    <p className="text-[10px] text-zinc-450 mt-0.5 leading-relaxed">
                      Configure active category filters. Write exactly one category tag per line. Top fabrics or filters matching these lines will group automatically.
                    </p>
                  </div>
                  <textarea
                    rows={8}
                    value={editingCategoriesText}
                    onChange={(e) => setEditingCategoriesText(e.target.value)}
                    placeholder="Flowers&#10;Kimmi&#10;Characters"
                    className="w-full p-3 text-xs border border-zinc-250 rounded-xl bg-zinc-50 font-mono focus:outline-none focus:bg-white leading-relaxed text-zinc-800 font-medium"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      const parsed = editingCategoriesText.split('\n').map(line => line.trim()).filter(Boolean);
                      if (parsed.length === 0) {
                        setAdminError('At least one active category is required.');
                        return;
                      }
                      setCategories(parsed);
                      const success = await saveDatabase({
                        settings: {
                          categories: parsed,
                          shopLogoUrl,
                          merchantEmail,
                          merchantPhone
                        }
                      });
                      if (success) {
                        setAdminSuccess('Shop categories updated successfully!');
                      }
                    }}
                    className="w-full bg-zinc-900 hover:bg-zinc-850 text-white font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all active:scale-97 cursor-pointer"
                  >
                    Save Category Configuration
                  </button>
                </div>
              )}

              {/* TAB 7: CUSTOMER FEEDBACK (IN SHOP LEVEL) */}
              {activeShopTab === 'feedback' && (
                <div className="space-y-3 max-w-2xl">
                  {(!feedback || feedback.length === 0) ? (
                    <div className="bg-white border border-zinc-200 rounded-3xl p-8 text-center text-xs text-zinc-450 shadow-3xs">
                      No feedback submitted yet. This fills up as customers complete orders and answer the quick feedback popup.
                    </div>
                  ) : (
                    feedback.map((fb: any) => (
                      <div key={fb.id} className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-3xs space-y-2 text-left">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <span key={n} className={fb.rating >= n ? 'text-amber-400' : 'text-zinc-200'}>★</span>
                            ))}
                          </div>
                          <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                            {fb.inquiryNumber} • {fb.submittedAt ? new Date(fb.submittedAt).toLocaleDateString() : ''}
                          </span>
                        </div>
                        {fb.easeOfOrdering && (
                          <p className="text-xs text-zinc-700"><span className="font-bold">Ease of ordering:</span> {fb.easeOfOrdering}</p>
                        )}
                        {fb.wouldRecommend && (
                          <p className="text-xs text-zinc-700"><span className="font-bold">Would recommend:</span> {fb.wouldRecommend}</p>
                        )}
                        {fb.whatCouldBeSimpler && (
                          <p className="text-xs text-zinc-700"><span className="font-bold">What could be simpler:</span> {fb.whatCouldBeSimpler}</p>
                        )}
                        {fb.otherComments && (
                          <p className="text-xs text-zinc-700"><span className="font-bold">Other comments:</span> {fb.otherComments}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}


            </div>
          )}

          {/* SETTINGS VIEW CONTAINER */}
          {activeSidebar === 'settings' && (
            <div className="space-y-6">
              
              {/* Settings navigation bar */}
              <div className="flex flex-wrap gap-1.5 border-b border-zinc-200 pb-3">
                {[
                  { id: 'routing', label: 'Store Routing & Password', emoji: '📧' },
                  { id: 'publishing', label: 'GitHub Publishing', emoji: '🐱' },
                  { id: 'database', label: 'Backups & Diagnostics', emoji: '💾' },
                  { id: 'danger', label: 'Danger Zone', emoji: '⚠️' }
                ].map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setActiveSettingsTab(t.id as any);
                      setAdminError('');
                      setAdminSuccess('');
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wide transition-all cursor-pointer ${
                      activeSettingsTab === t.id
                        ? 'bg-[#E05C97] text-white shadow-xs'
                        : 'bg-white text-zinc-650 border border-zinc-200 hover:bg-zinc-100 hover:text-zinc-800'
                    }`}
                  >
                    <span>{t.emoji}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>

              {/* SETTINGS SUBTAB 1: ROUTING & CONTACTS */}
              {activeSettingsTab === 'routing' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                  
                  {/* Order Receipt Contacts */}
                  <div className="bg-white p-5 rounded-2xl border border-zinc-200 space-y-4 shadow-3xs">
                    <h4 className="text-[11px] font-black uppercase text-zinc-850 tracking-wider flex items-center gap-1.5">
                      <span>📧</span> Order Receipt Contacts
                    </h4>
                    <p className="text-[10px] text-zinc-400 leading-normal">
                      Direct where customer bespoke order requests are routed via Email and WhatsApp.
                    </p>
                    <div className="space-y-3">
                      <div className="space-y-0.5">
                        <label className="text-[9px] text-zinc-500 font-extrabold uppercase">Merchant Email Address</label>
                        <input
                          type="email"
                          placeholder="e.g. nilam1978@gmail.com"
                          value={merchantEmail}
                          onChange={(e) => setMerchantEmail(e.target.value)}
                          className="w-full p-2.5 text-xs border border-zinc-250 rounded-lg bg-zinc-50 text-zinc-800 font-medium focus:outline-none"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <label className="text-[9px] text-zinc-500 font-extrabold uppercase">WhatsApp Phone (Country Code First)</label>
                        <input
                          type="text"
                          placeholder="e.g. 6583397556"
                          value={merchantPhone}
                          onChange={(e) => setMerchantPhone(e.target.value)}
                          className="w-full p-2.5 text-xs border border-zinc-250 rounded-lg bg-zinc-50 text-zinc-850 font-mono focus:outline-none"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!merchantEmail.trim()) {
                          setAdminError('Email address is required.');
                          return;
                        }
                        const success = await saveDatabase({
                          settings: {
                            categories,
                            shopLogoUrl,
                            merchantEmail: merchantEmail.trim(),
                            merchantPhone: merchantPhone.trim()
                          }
                        });
                        if (success) setAdminSuccess('Order contact settings saved!');
                      }}
                      className="w-full bg-zinc-900 hover:bg-zinc-850 text-white font-extrabold py-2 px-3 rounded-lg text-xs transition-all cursor-pointer"
                    >
                      Save Routing Contacts
                    </button>
                  </div>

                  {/* Password & Branding */}
                  <div className="bg-white p-5 rounded-2xl border border-zinc-200 space-y-4 shadow-3xs flex flex-col justify-between">
                    <div className="space-y-3">
                      <h4 className="text-[11px] font-black uppercase text-zinc-850 tracking-wider flex items-center gap-1.5">
                        <span>🔒</span> Administration Security
                      </h4>
                      <p className="text-[10px] text-zinc-400 leading-normal">
                        Update your back-office master password or edit lookbook visibility.
                      </p>
                      <input
                        type="password"
                        placeholder="Type new secret password..."
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        className="w-full p-2.5 text-xs border border-zinc-250 rounded-lg bg-zinc-50 focus:outline-none text-zinc-850"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          if (!newAdminPassword.trim()) {
                            setAdminError('Password cannot be empty.');
                            return;
                          }
                          setActivePassword(newAdminPassword.trim());
                          localStorage.setItem('admin_session_auth', newAdminPassword.trim());
                          const success = await saveDatabase({
                            settings: {
                              adminPassword: newAdminPassword.trim(),
                              categories,
                              shopLogoUrl,
                              merchantEmail,
                              merchantPhone
                            }
                          });
                          if (success) {
                            setAdminSuccess('Admin password changed successfully!');
                            setNewAdminPassword('');
                          }
                        }}
                        className="w-full bg-zinc-900 hover:bg-zinc-850 text-white font-extrabold py-2 px-3 rounded-lg text-xs transition-all cursor-pointer"
                      >
                        Update Master Password
                      </button>
                    </div>

                    <div className="border-t border-zinc-100 pt-3 mt-3 text-left">
                      <h5 className="text-[10px] font-black uppercase text-zinc-700 tracking-wider mb-2">LOOKBOOK ACTIVE VISIBILITY</h5>
                      <div className="flex items-center justify-between p-2 bg-zinc-50 rounded-xl border border-zinc-200">
                        <span className="text-[9.5px] font-bold">Status: {hideLookbookInBackOffice ? "🔴 HIDDEN" : "🟢 LIVE"}</span>
                        <button
                          type="button"
                          onClick={async () => {
                            const success = await toggleHideLookbookInBackOffice(!hideLookbookInBackOffice);
                            if (success) setAdminSuccess('Fabric Gallery visibility changed!');
                          }}
                          className="bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-700 font-extrabold text-[9px] px-3 py-1.5 rounded-lg"
                        >
                          {hideLookbookInBackOffice ? "Set Live" : "Set Placeholder"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Shop Logo & Bulk Auto Match */}
                  <div className="bg-white p-5 rounded-2xl border border-zinc-200 space-y-4 shadow-3xs md:col-span-2">
                    <h4 className="text-[11px] font-black uppercase text-zinc-850 tracking-wider flex items-center gap-1.5">
                      <span>🖼️</span> Branding &amp; Image Auto-Match Utilities
                    </h4>
                    <p className="text-[10px] text-zinc-400 leading-relaxed">
                      Upload your shop logo or automatically match and link R2 lookbook photo files to your fabric patterns.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[8.5px] text-zinc-400 font-extrabold uppercase">Branding Logo URL</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Logo URL link..."
                            value={shopLogoUrl}
                            onChange={(e) => setShopLogoUrl(e.target.value)}
                            className="flex-1 p-2 text-xs border border-zinc-250 rounded-lg bg-zinc-50 font-mono"
                          />
                          <label className="bg-[#7D8F7D] hover:bg-[#6C7E6C] text-white text-[10px] font-bold py-2.5 px-3 rounded-lg cursor-pointer flex items-center justify-center gap-1 shrink-0">
                            {isUploadingLogo ? '...' : '📁 Logo'}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={isUploadingLogo}
                              onChange={async (e) => {
                                if (e.target.files && e.target.files[0]) {
                                  try {
                                    setIsUploadingLogo(true);
                                    const url = await handleUploadToR2(e.target.files[0]);
                                    setShopLogoUrl(url);
                                    await saveDatabase({
                                      settings: { categories, shopLogoUrl: url, merchantEmail, merchantPhone }
                                    });
                                    setAdminSuccess('Shop branding logo saved!');
                                  } catch (err: any) {
                                    setAdminError('Upload failed: ' + err.message);
                                  } finally {
                                    setIsUploadingLogo(false);
                                  }
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="space-y-2 text-left">
                        <label className="text-[8.5px] text-zinc-400 font-extrabold uppercase">Filename Auto-Match Sync</label>
                        <button
                          type="button"
                          disabled={isAutoMatching || !lookbookPhotos || lookbookPhotos.length === 0}
                          onClick={runAutoMatch}
                          className="w-full bg-[#E05C97] hover:bg-[#C43D71] disabled:bg-zinc-300 text-white font-extrabold py-2 px-3 rounded-lg text-xs transition-colors shadow-3xs flex items-center justify-center gap-1.5"
                        >
                          {isAutoMatching ? 'Syncing...' : '⚡ Auto-Match R2 Images'}
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* SETTINGS SUBTAB 2: GITHUB PUBLISHING */}
              {activeSettingsTab === 'publishing' && (
                <div className="bg-white p-5 rounded-2xl border border-zinc-200 space-y-4 shadow-3xs text-left max-w-xl">
                  <h4 className="text-[11px] font-black uppercase text-zinc-850 tracking-wider flex items-center gap-1.5">
                    <span>🐱</span> GitHub Publishing Sync
                  </h4>
                  <p className="text-[10px] text-zinc-500 leading-relaxed">
                    Pushes your updated local JSON database configs directly to the live GitHub repository branch so they become permanent.
                  </p>

                  <div className="border border-zinc-200 rounded-xl overflow-hidden bg-zinc-50/50">
                    <summary className="p-3 text-[10.5px] font-bold text-zinc-700 select-none">
                      ⚙️ Repository Target Sync Configurations
                    </summary>
                    <div className="p-3 border-t border-zinc-150 bg-white grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-[8.5px] text-zinc-400 font-extrabold uppercase">Username</label>
                        <input
                          type="text" value={ghOwner}
                          onChange={(e) => { setGhOwner(e.target.value); localStorage.setItem('gh_sync_owner', e.target.value); }}
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-zinc-250 bg-zinc-50"
                        />
                      </div>
                      <div>
                        <label className="text-[8.5px] text-zinc-400 font-extrabold uppercase">Repo</label>
                        <input
                          type="text" value={ghRepo}
                          onChange={(e) => { setGhRepo(e.target.value); localStorage.setItem('gh_sync_repo', e.target.value); }}
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-zinc-250 bg-zinc-50"
                        />
                      </div>
                      <div>
                        <label className="text-[8.5px] text-zinc-400 font-extrabold uppercase">Branch</label>
                        <input
                          type="text" value={ghBranch}
                          onChange={(e) => { setGhBranch(e.target.value); localStorage.setItem('gh_sync_branch', e.target.value); }}
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-zinc-250 bg-zinc-50"
                        />
                      </div>
                      <div>
                        <label className="text-[8.5px] text-zinc-400 font-extrabold uppercase">Commit message</label>
                        <input
                          type="text" value={ghCommitMsg} onChange={(e) => setGhCommitMsg(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-zinc-250 bg-zinc-50"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={publishToGithub}
                    disabled={isPublishingToGithub}
                    className="w-full bg-zinc-900 hover:bg-zinc-850 disabled:bg-zinc-300 text-white font-extrabold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all"
                  >
                    {isPublishingToGithub ? 'Syncing and pushing to branch...' : '🚀 Publish Database to GitHub Repository'}
                  </button>
                </div>
              )}

              {/* SETTINGS SUBTAB 3: DATABASE BACKUPS */}
              {activeSettingsTab === 'database' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                  
                  {/* Backup & Restore */}
                  <div className="bg-white p-5 rounded-2xl border border-zinc-200 space-y-4 shadow-3xs">
                    <h4 className="text-[11px] font-black uppercase text-zinc-850 tracking-wider flex items-center gap-1.5">
                      <span>💾</span> JSON Database Backups
                    </h4>
                    <p className="text-[10px] text-zinc-400 leading-normal">
                      Export and save your entire customizer configuration schema as a local file, or restore from a previous backup file.
                    </p>

                    <div className="flex flex-col gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          const dbPayload = {
                            fabricsTop, fabricsBacking, sizeOptions, absorbencyOptions, readyMadeStocks, shapeOptions, washingFaq, blogPosts,
                            settings: { adminPassword: activePassword, categories, shopLogoUrl, merchantEmail, merchantPhone }
                          };
                          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dbPayload, null, 2));
                          const anchor = document.createElement('a');
                          anchor.setAttribute("href", dataStr);
                          anchor.setAttribute("download", "customizer-db-backup.json");
                          document.body.appendChild(anchor);
                          anchor.click();
                          anchor.remove();
                          setAdminSuccess('JSON database backup exported!');
                        }}
                        className="w-full bg-[#7D8F7D] hover:bg-[#6C7E6C] text-white font-extrabold py-2.5 px-3 rounded-lg text-xs tracking-wider uppercase transition-colors text-center"
                      >
                        📥 Export JSON Database Backup
                      </button>

                      <div className="border-t border-dashed border-zinc-200 pt-2 text-center">
                        <label className="w-full border border-zinc-250 hover:bg-zinc-50 text-zinc-700 text-xs font-black py-2.5 px-3 rounded-lg cursor-pointer flex items-center justify-center gap-1.5 transition-colors uppercase">
                          <span>📤</span> Restore from Backup File
                          <input
                            type="file" accept=".json" className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                const reader = new FileReader();
                                reader.onload = async (ev) => {
                                  try {
                                    const parsed = JSON.parse(ev.target?.result as string);
                                    if (parsed.fabricsTop || parsed.readyMadeStocks || parsed.sizeOptions) {
                                      if (parsed.fabricsTop) setFabricsTop(parsed.fabricsTop);
                                      if (parsed.fabricsBacking) setFabricsBacking(parsed.fabricsBacking);
                                      if (parsed.sizeOptions) setSizeOptions(parsed.sizeOptions);
                                      if (parsed.absorbencyOptions) setAbsorbencyOptions(parsed.absorbencyOptions);
                                      if (parsed.readyMadeStocks) setReadyMadeStocks(parsed.readyMadeStocks);
                                      if (parsed.shapeOptions) setShapeOptions(parsed.shapeOptions);
                                      if (parsed.washingFaq) setWashingFaq(parsed.washingFaq);
                                      if (parsed.blogPosts) setBlogPosts(parsed.blogPosts);
                                      if (parsed.settings?.categories) {
                                        setCategories(parsed.settings.categories);
                                        setEditingCategoriesText(parsed.settings.categories.join('\n'));
                                      }
                                      if (parsed.settings?.shopLogoUrl) setShopLogoUrl(parsed.settings.shopLogoUrl);
                                      if (parsed.settings?.merchantEmail) setMerchantEmail(parsed.settings.merchantEmail);
                                      if (parsed.settings?.merchantPhone) setMerchantPhone(parsed.settings.merchantPhone);
                                      
                                      await saveDatabase({
                                        fabricsTop: parsed.fabricsTop || fabricsTop,
                                        fabricsBacking: parsed.fabricsBacking || fabricsBacking,
                                        sizeOptions: parsed.sizeOptions || sizeOptions,
                                        absorbencyOptions: parsed.absorbencyOptions || absorbencyOptions,
                                        readyMadeStocks: parsed.readyMadeStocks || readyMadeStocks,
                                        shapeOptions: parsed.shapeOptions || shapeOptions,
                                        washingFaq: parsed.washingFaq || washingFaq,
                                        blogPosts: parsed.blogPosts || blogPosts,
                                        settings: {
                                          adminPassword: parsed.settings?.adminPassword || activePassword,
                                          categories: parsed.settings?.categories || categories,
                                          shopLogoUrl: parsed.settings?.shopLogoUrl || shopLogoUrl,
                                          merchantEmail: parsed.settings?.merchantEmail || merchantEmail,
                                          merchantPhone: parsed.settings?.merchantPhone || merchantPhone
                                        }
                                      });
                                      setAdminSuccess('Database fully restored!');
                                    }
                                  } catch (err: any) {
                                    setAdminError('Restore failed: ' + err.message);
                                  }
                                };
                                reader.readAsText(e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Diagnositcs */}
                  <div className="bg-zinc-100 border border-zinc-200 p-5 rounded-2xl space-y-3 shadow-inner">
                    <h4 className="text-[11px] font-black uppercase text-zinc-800 tracking-wider">📡 Connection Board &amp; Statuses</h4>
                    <p className="text-[9.5px] text-zinc-500 leading-relaxed">View persistent cloud integrations, databases, and media storage libraries.</p>
                    <div className="space-y-1.5 text-xs text-zinc-700">
                      <div>
                        <strong>Firebase Firestore DB:</strong>{' '}
                        {firebaseStatus?.connected ? (
                          <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-extrabold uppercase text-[9px]">🟢 Connected</span>
                        ) : (
                          <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-extrabold uppercase text-[9px]">🟡 Offline Fallback</span>
                        )}
                      </div>
                      <div>
                        <strong>R2 Media lookbook:</strong>{' '}
                        {isR2Mock ? (
                          <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-extrabold uppercase text-[9px]">🟡 Offline Mocked</span>
                        ) : (
                          <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-extrabold uppercase text-[9px]">🟢 Live R2 Store</span>
                        )}
                      </div>
                      <div><strong>Active Fabrics count:</strong> {fabricsTop.length + fabricsBacking.length}</div>
                      <div><strong>Active Ready stock RTS count:</strong> {readyMadeStocks.length}</div>
                    </div>
                  </div>

                </div>
              )}

              {/* SETTINGS SUBTAB 4: DANGER ZONE */}
              {activeSettingsTab === 'danger' && (
                <div className="bg-red-50/50 border border-red-150 p-6 rounded-3xl max-w-lg text-left space-y-4">
                  <h4 className="text-[12px] font-black uppercase text-red-700 tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Dangerous Store Administrations</span>
                  </h4>
                  <p className="text-[10.5px] text-zinc-650 leading-relaxed">
                    These actions are final. Wiping the database resets all fabrics, sizing tables, products, FAQs, and blogs. Export a backup before doing this!
                  </p>

                  {showEraseConfirm ? (
                    <div className="bg-white p-4 border border-red-200 rounded-2xl space-y-3">
                      <p className="text-[10px] font-extrabold text-red-900 leading-normal">
                        Type the word <strong className="font-mono bg-red-100 px-1 py-0.5 text-red-900 rounded">WonderPads</strong> exactly to confirm wipeout:
                      </p>
                      <input
                        type="text" placeholder="Type: WonderPads" value={eraseConfirmText}
                        onChange={(e) => setEraseConfirmText(e.target.value)}
                        className="w-full text-center p-2.5 text-xs border border-zinc-250 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 font-extrabold"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button" disabled={eraseConfirmText !== 'WonderPads'}
                          onClick={async () => {
                            setFabricsTop([]); setFabricsBacking([]); setSizeOptions([]); setAbsorbencyOptions([]); setReadyMadeStocks([]); setWashingFaq([]); setBlogPosts([]);
                            await saveDatabase({ fabricsTop: [], fabricsBacking: [], sizeOptions: [], absorbencyOptions: [], readyMadeStocks: [], washingFaq: [], blogPosts: [] });
                            setAdminSuccess('Store fully erased and started fresh!');
                            setShowEraseConfirm(false);
                            setEraseConfirmText('');
                          }}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-extrabold py-2 rounded-lg text-xs"
                        >
                          ERASE ALL DATA NOW
                        </button>
                        <button
                          type="button" onClick={() => { setShowEraseConfirm(false); setEraseConfirmText(''); }}
                          className="bg-zinc-200 text-zinc-750 font-bold px-4 py-2 rounded-lg text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowEraseConfirm(true)}
                      className="bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider px-6 py-3 rounded-2xl transition-all hover:scale-102"
                    >
                      💣 Wipe Entire Store Database
                    </button>
                  )}
                </div>
              )}

            </div>
          )}

        </div>
      </div>

      {/* ================= MODAL 1: FABRICS ADD/EDIT ================= */}
      {fabricModalOpen && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-3xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-lg w-full flex flex-col max-h-[90vh] text-left">
            <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50 rounded-t-3xl">
              <h4 className="text-xs font-black uppercase text-zinc-800 tracking-wider">
                {editingFabric ? '✏️ Edit Fabric Print' : '➕ Add Fabric Print'}
              </h4>
              <button type="button" onClick={() => setFabricModalOpen(false)} className="text-zinc-450 hover:text-zinc-800"><X className="h-4 w-4" /></button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-450 font-black uppercase">Print Name</label>
                  <input
                    type="text" value={fabName} onChange={(e) => setFabName(e.target.value)}
                    className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none text-zinc-800 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-450 font-black uppercase">Category / Collection</label>
                  <select
                    value={fabCategory} onChange={(e) => setFabCategory(e.target.value)}
                    className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none font-sans"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    <option value="Backing Fabric">Backing Fabric (Hidden from customization selection)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-450 font-black uppercase">Fabric Material</label>
                  <input
                    type="text" value={fabMaterial} onChange={(e) => setFabMaterial(e.target.value)}
                    className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-450 font-black uppercase">Premium Cost Upgrade (S$)</label>
                  <input
                    type="number" step="0.5" value={fabPremium} onChange={(e) => setFabPremium(e.target.value)}
                    className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-zinc-450 font-black uppercase">Tags / Properties (Comma-separated)</label>
                <input
                  type="text" placeholder="Breathable, Cozy, Stain-resistant" value={fabProperties} onChange={(e) => setFabProperties(e.target.value)}
                  className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-zinc-450 font-black uppercase">In Stock Status</label>
                <div className="flex gap-2">
                  {['in_stock', 'low_stock', 'out_of_stock'].map((st) => (
                    <button
                      key={st} type="button" onClick={() => setFabStock(st as any)}
                      className={`flex-1 py-1.5 px-3 border rounded-lg text-[10px] font-extrabold uppercase transition-all ${
                        fabStock === st
                          ? 'bg-[#7D8F7D] text-white border-[#7D8F7D]'
                          : 'bg-white text-zinc-600 border-zinc-250 hover:bg-zinc-50'
                      }`}
                    >
                      {st.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-zinc-450 font-black uppercase">Fabric Image Source URL</label>
                <div className="flex gap-2">
                  <input
                    type="text" placeholder="https://..." value={fabImageUrl} onChange={(e) => setFabImageUrl(e.target.value)}
                    className="flex-1 p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none font-mono text-zinc-700"
                  />
                  <label className="bg-zinc-900 hover:bg-zinc-800 text-white text-[10px] font-bold py-2.5 px-4 rounded-xl cursor-pointer shrink-0">
                    {isUploadingFab ? '...' : 'Upload File'}
                    <input
                      type="file" accept="image/*" className="hidden" disabled={isUploadingFab}
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          try {
                            setIsUploadingFab(true);
                            const url = await handleUploadToR2(e.target.files[0]);
                            setFabImageUrl(url);
                          } catch (err: any) {
                            alert(err.message);
                          } finally {
                            setIsUploadingFab(false);
                          }
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-zinc-100 flex gap-2 justify-end bg-zinc-50 rounded-b-3xl">
              <button type="button" onClick={handleSaveFabric} className="bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl">
                💾 Save Print Config
              </button>
              <button type="button" onClick={() => setFabricModalOpen(false)} className="bg-zinc-200 text-zinc-700 font-extrabold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: READY STOCK ADD/EDIT ================= */}
      {rtsModalOpen && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-3xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-lg w-full flex flex-col max-h-[90vh] text-left">
            <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50 rounded-t-3xl">
              <h4 className="text-xs font-black uppercase text-zinc-800 tracking-wider">
                {editingRts ? '✏️ Edit Ready-Made Pad' : '➕ Add Ready-Made Pad'}
              </h4>
              <button type="button" onClick={() => setRtsModalOpen(false)} className="text-zinc-450 hover:text-zinc-800"><X className="h-4 w-4" /></button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-450 font-black uppercase">Custom Title / Identifier (Optional)</label>
                  <input
                    type="text" placeholder="Leave empty to auto-calculate name" value={rtsName} onChange={(e) => setRtsName(e.target.value)}
                    className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-450 font-black uppercase">Product Category / Absorbency</label>
                  <select
                    value={rtsAbsorbency} onChange={(e) => setRtsAbsorbency(e.target.value)}
                    className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none"
                  >
                    <option value="Liner">Liner</option>
                    <option value="Light">Light</option>
                    <option value="Moderate dry">Moderate</option>
                    <option value="Heavy dry">Heavy</option>
                    <option value="Extra Long">Extra Long</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-450 font-black uppercase">Print Pattern Name</label>
                  <input
                    type="text" value={rtsPrint} onChange={(e) => setRtsPrint(e.target.value)}
                    className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none text-zinc-800 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-450 font-black uppercase">Size Dimension</label>
                  <select
                    value={rtsSize} onChange={(e) => setRtsSize(e.target.value)}
                    className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none"
                  >
                    {sizeOptions.map(opt => (
                      <option key={opt.id} value={opt.displayLabel || opt.name}>{opt.displayLabel || opt.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-450 font-black uppercase">Price Tag (S$)</label>
                  <input
                    type="number" value={rtsPrice} onChange={(e) => setRtsPrice(e.target.value)}
                    className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-450 font-black uppercase">Quantity Available</label>
                  <input
                    type="number" value={rtsQuantity} onChange={(e) => setRtsQuantity(e.target.value)}
                    className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none font-mono"
                  />
                </div>

                {/* RTS Shape field dropdown (Empty first by default for user to fill in, options in dropdown) */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[9px] text-zinc-450 font-black uppercase">Pad Shape Design</label>
                  <select
                    value={rtsShape} onChange={(e) => setRtsShape(e.target.value)}
                    className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none font-sans font-bold"
                  >
                    <option value="">-- No Shape Selected (Empty) --</option>
                    <option value="moon_rise">🌙 MoonRise</option>
                    <option value="sunglow">☀️ SunGlow</option>
                    <option value="staple">📎 Staple</option>
                    <option value="mega_pad">👑 MegaPad</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-zinc-450 font-black uppercase">Product Description</label>
                <textarea
                  rows={2} value={rtsDescription} onChange={(e) => setRtsDescription(e.target.value)}
                  placeholder="Leave empty for generic description"
                  className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-zinc-450 font-black uppercase">Product Image URL Source</label>
                <div className="flex gap-2">
                  <input
                    type="text" placeholder="https://..." value={rtsImageUrl} onChange={(e) => setRtsImageUrl(e.target.value)}
                    className="flex-1 p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none font-mono text-zinc-700"
                  />
                  <label className="bg-zinc-900 hover:bg-zinc-800 text-white text-[10px] font-bold py-2.5 px-4 rounded-xl cursor-pointer shrink-0">
                    {isUploadingRts ? '...' : 'Upload File'}
                    <input
                      type="file" accept="image/*" className="hidden" disabled={isUploadingRts}
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          try {
                            setIsUploadingRts(true);
                            const url = await handleUploadToR2(e.target.files[0]);
                            setRtsImageUrl(url);
                          } catch (err: any) {
                            alert(err.message);
                          } finally {
                            setIsUploadingRts(false);
                          }
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-zinc-450 font-black uppercase">Private Admin Shelf / Storage Notes</label>
                <input
                  type="text" placeholder="Storage shelf, defect notes..." value={rtsNotes} onChange={(e) => setRtsNotes(e.target.value)}
                  className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 border-t border-zinc-100 flex gap-2 justify-end bg-zinc-50 rounded-b-3xl">
              <button type="button" onClick={handleSaveRts} className="bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl">
                💾 Save RTS Pad
              </button>
              <button type="button" onClick={() => setRtsModalOpen(false)} className="bg-zinc-200 text-zinc-700 font-extrabold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: FAQ ADD/EDIT ================= */}
      {faqModalOpen && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-3xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-lg w-full flex flex-col text-left">
            <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50 rounded-t-3xl">
              <h4 className="text-xs font-black uppercase text-zinc-800 tracking-wider">
                {editingFaq ? '✏️ Edit FAQ' : '➕ Add FAQ'}
              </h4>
              <button type="button" onClick={() => setFaqModalOpen(false)} className="text-zinc-450 hover:text-zinc-800"><X className="h-4 w-4" /></button>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] text-zinc-450 font-black uppercase">FAQ Question Text</label>
                <input
                  type="text" value={faqQuestion} onChange={(e) => setFaqQuestion(e.target.value)}
                  className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none text-zinc-800 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-zinc-450 font-black uppercase">FAQ Answer</label>
                <textarea
                  rows={4} value={faqAnswer} onChange={(e) => setFaqAnswer(e.target.value)}
                  className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none text-zinc-750 leading-relaxed"
                />
              </div>
            </div>

            <div className="p-4 border-t border-zinc-100 flex gap-2 justify-end bg-zinc-50 rounded-b-3xl">
              <button type="button" onClick={handleSaveFaq} className="bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl">
                💾 Save FAQ
              </button>
              <button type="button" onClick={() => setFaqModalOpen(false)} className="bg-zinc-200 text-zinc-700 font-extrabold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: BLOG ADD/EDIT ================= */}
      {blogModalOpen && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-3xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-lg w-full flex flex-col max-h-[90vh] text-left">
            <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50 rounded-t-3xl">
              <h4 className="text-xs font-black uppercase text-zinc-800 tracking-wider">
                {editingBlog ? '✏️ Edit Article' : '📝 New Article'}
              </h4>
              <button type="button" onClick={() => setBlogModalOpen(false)} className="text-zinc-450 hover:text-zinc-800"><X className="h-4 w-4" /></button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-450 font-black uppercase">Article Title</label>
                  <input
                    type="text" value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)}
                    className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none font-bold text-zinc-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-450 font-black uppercase">Author Name</label>
                  <input
                    type="text" value={blogAuthor} onChange={(e) => setBlogAuthor(e.target.value)}
                    className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-zinc-450 font-black uppercase">Content</label>
                <textarea
                  rows={6} value={blogContent} onChange={(e) => setBlogContent(e.target.value)}
                  className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none text-zinc-750 leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-zinc-450 font-black uppercase">Cover Photo Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text" placeholder="https://..." value={blogImageUrl} onChange={(e) => setBlogImageUrl(e.target.value)}
                    className="flex-1 p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none font-mono text-zinc-700"
                  />
                  <label className="bg-zinc-900 hover:bg-zinc-800 text-white text-[10px] font-bold py-2.5 px-4 rounded-xl cursor-pointer shrink-0">
                    {isUploadingBlog ? '...' : 'Upload File'}
                    <input
                      type="file" accept="image/*" className="hidden" disabled={isUploadingBlog}
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          try {
                            setIsUploadingBlog(true);
                            const url = await handleUploadToR2(e.target.files[0]);
                            setBlogImageUrl(url);
                          } catch (err: any) {
                            alert(err.message);
                          } finally {
                            setIsUploadingBlog(false);
                          }
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-zinc-100 flex gap-2 justify-end bg-zinc-50 rounded-b-3xl">
              <button type="button" onClick={handleSaveBlog} className="bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl">
                💾 Save Article
              </button>
              <button type="button" onClick={() => setBlogModalOpen(false)} className="bg-zinc-200 text-zinc-700 font-extrabold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
