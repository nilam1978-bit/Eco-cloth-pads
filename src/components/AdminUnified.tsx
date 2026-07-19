import React, { useState } from 'react';

// Product type to display name map
const RTS_NAME_MAP: Record<string, string> = {
  'Liner': 'Mini Pantyliner',
  'Light': 'Light Day Pad',
  'Moderate': 'Regular Day Pad',
  'Moderate dry': 'Regular Day Pad',
  'Heavy': 'Heavy Night Pad',
  'Heavy dry': 'Heavy Night Pad',
  'Extra Long': 'Overnight Safety Pad'
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
}

export const AdminUnified: React.FC<AdminUnifiedProps> = ({
  fabricsTop,
  setFabricsTop,
  fabricsBacking,
  setFabricsBacking,
  sizeOptions,
  setSizeOptions,
  absorbencyOptions,
  setAbsorbencyOptions,
  readyMadeStocks,
  setReadyMadeStocks,
  shapeOptions,
  setShapeOptions,
  washingFaq,
  setWashingFaq,
  blogPosts,
  setBlogPosts,

  categories,
  setCategories,
  editingCategoriesText,
  setEditingCategoriesText,
  shopLogoUrl,
  setShopLogoUrl,
  merchantEmail,
  setMerchantEmail,
  merchantPhone,
  setMerchantPhone,

  saveDatabase,
  handleUploadToR2,
  activePassword,
  setActivePassword,
  setIsAdminAuthenticated,
  setAdminPasswordInput,

  adminSuccess,
  setAdminSuccess,
  adminError,
  setAdminError,

  lookbookPhotos,
  setLookbookPhotos,
  isLoadingPhotos,
  setIsLoadingPhotos,

  publishToGithub,
  isPublishingToGithub,
  ghOwner,
  setGhOwner,
  ghRepo,
  setGhRepo,
  ghBranch,
  setGhBranch,
  ghCommitMsg,
  setGhCommitMsg,

  firebaseStatus,
  setFirebaseStatus,
  isR2Mock,
  onClose
}) => {
  // Views
  const [adminView, setAdminView] = useState<'add' | 'edit' | 'settings'>('add');
  const [activeAddType, setActiveAddType] = useState<'fabric' | 'pad' | 'size' | 'faq' | 'blog'>('fabric');
  const [adminEditSearch, setAdminEditSearch] = useState('');
  const [adminEditingItem, setAdminEditingItem] = useState<{ type: 'fabric' | 'pad' | 'size' | 'faq' | 'blog', data: any } | null>(null);

  // Simple Form States
  const [newFabName, setNewFabName] = useState('');
  const [newFabCategory, setNewFabCategory] = useState(categories[0] || 'Flowers');
  const [newFabMaterial, setNewFabMaterial] = useState('');
  const [newFabPremium, setNewFabPremium] = useState('0.00');
  const [newFabProperties, setNewFabProperties] = useState('');
  const [newFabStock, setNewFabStock] = useState<'in_stock' | 'low_stock' | 'out_of_stock'>('in_stock');
  const [newFabImageUrl, setNewFabImageUrl] = useState('');
  const [isUploadingFab, setIsUploadingFab] = useState(false);

  const [newRtsName, setNewRtsName] = useState('');
  const [newRtsDescription, setNewRtsDescription] = useState('');
  const [newRtsPrice, setNewRtsPrice] = useState('15.00');
  const [newRtsSize, setNewRtsSize] = useState('Regular Day (8")');
  const [newRtsPrint, setNewRtsPrint] = useState('');
  const [newRtsAbsorbency, setNewRtsAbsorbency] = useState('Moderate dry');
  const [newRtsQuantity, setNewRtsQuantity] = useState('1');
  const [newRtsImageUrl, setNewRtsImageUrl] = useState('');
  const [newRtsNotes, setNewRtsNotes] = useState('');
  const [isUploadingRts, setIsUploadingRts] = useState(false);

  const [newSizeId, setNewSizeId] = useState('');
  const [newSizeName, setNewSizeName] = useState('');
  const [newSizeLabel, setNewSizeLabel] = useState('');
  const [newSizeLength, setNewSizeLength] = useState('8');
  const [newSizePrice, setNewSizePrice] = useState('11.00');
  const [newSizeDescription, setNewSizeDescription] = useState('');

  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');

  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogContent, setNewBlogContent] = useState('');
  const [newBlogImageUrl, setNewBlogImageUrl] = useState('');
  const [newBlogAuthor, setNewBlogAuthor] = useState('WonderPads');
  const [isUploadingBlog, setIsUploadingBlog] = useState(false);

  // Settings states
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [showAdvancedImport, setShowAdvancedImport] = useState(false);

  // RTS batch import state
  const [rtsBulkImportTag, setRtsBulkImportTag] = useState('pads');
  const [isRtsBulkImporting, setIsRtsBulkImporting] = useState(false);

  // Erase States
  const [showEraseConfirmationModal, setShowEraseConfirmationModal] = useState(false);
  const [eraseConfirmationInput, setEraseConfirmationInput] = useState('');

  const resetAddFormStates = () => {
    setNewFabName('');
    setNewFabCategory(categories[0] || 'Flowers');
    setNewFabMaterial('');
    setNewFabPremium('0.00');
    setNewFabProperties('');
    setNewFabStock('in_stock');
    setNewFabImageUrl('');

    setNewRtsName('');
    setNewRtsDescription('');
    setNewRtsPrice('15.00');
    setNewRtsSize('Regular Day (8")');
    setNewRtsPrint('');
    setNewRtsAbsorbency('Moderate dry');
    setNewRtsQuantity('1');
    setNewRtsImageUrl('');
    setNewRtsNotes('');

    setNewSizeId('');
    setNewSizeName('');
    setNewSizeLabel('');
    setNewSizeLength('8');
    setNewSizePrice('11.00');
    setNewSizeDescription('');

    setNewFaqQuestion('');
    setNewFaqAnswer('');

    setNewBlogTitle('');
    setNewBlogContent('');
    setNewBlogImageUrl('');
    setNewBlogAuthor('WonderPads');

    setShowAdvancedImport(false);
  };

  const handleAddNewItem = async () => {
    setAdminError('');
    setAdminSuccess('');

    if (activeAddType === 'fabric') {
      if (!newFabName.trim()) {
        setAdminError('Fabric print name is required.');
        return;
      }
      const isBacking = newFabCategory === 'Backing Fabric';
      const computedId = 'fab-' + Date.now();
      const newFab = {
        id: computedId,
        name: newFabName.trim(),
        type: isBacking ? 'backing' : 'top',
        material: newFabMaterial.trim() || 'Cotton Woven',
        description: 'Wonder Premium Pattern',
        colorHex: '#ffffff',
        imageUrl: newFabImageUrl.trim() || 'https://images.unsplash.com/photo-1606293926075-69a00dbf9816?auto=format&fit=crop&q=80&w=200',
        premium: parseFloat(newFabPremium) || 0,
        properties: newFabProperties.split(',').map((s: string) => s.trim()).filter(Boolean),
        stockStatus: newFabStock,
        category: isBacking ? 'Backing Fabric' : newFabCategory,
        hidden: false
      };

      const updatedTops = isBacking ? fabricsTop : [...fabricsTop, newFab];
      const updatedBackings = isBacking ? [...fabricsBacking, newFab] : fabricsBacking;

      if (!isBacking) setFabricsTop(updatedTops);
      else setFabricsBacking(updatedBackings);

      const success = await saveDatabase({ fabricsTop: updatedTops, fabricsBacking: updatedBackings });
      if (success) {
        setAdminSuccess('Fabric print added successfully!');
        resetAddFormStates();
      }
    } 
    else if (activeAddType === 'pad') {
      if (!newRtsAbsorbency) {
        setAdminError('Product Type / absorbency is required.');
        return;
      }
      const computedId = 'rts-' + Date.now();
      const defaultRtsImage = 'https://images.unsplash.com/photo-1606293926075-69a00dbf9816?auto=format&fit=crop&q=80&w=200';
      const calculatedName = RTS_NAME_MAP[newRtsAbsorbency] || newRtsAbsorbency;
      const freshRts = {
        id: computedId,
        name: calculatedName,
        description: newRtsDescription.trim() || 'Pre-crafted limited release pack ready for immediate dispatch',
        price: parseFloat(newRtsPrice) || 15.00,
        quantityLeft: parseInt(newRtsQuantity) || 1,
        size: newRtsSize || '8 inch',
        sizeLabel: newRtsSize || '8 inch',
        print: newRtsPrint.trim() || '',
        printLabel: newRtsPrint.trim() || '',
        absorbency: newRtsAbsorbency,
        absorbencyLabel: newRtsAbsorbency,
        imageUrl: newRtsImageUrl.trim() || defaultRtsImage,
        adminNotes: newRtsNotes.trim(),
        hidden: false
      };
      const updatedRts = [...readyMadeStocks, freshRts];
      setReadyMadeStocks(updatedRts);
      const success = await saveDatabase({ readyMadeStocks: updatedRts });
      if (success) {
        setAdminSuccess('Ready-Made Pad added successfully!');
        resetAddFormStates();
      }
    }
    else if (activeAddType === 'size') {
      if (!newSizeId.trim() || !newSizeName.trim()) {
        setAdminError('Size ID and Name are required.');
        return;
      }
      const cleanId = newSizeId.trim().toLowerCase().replace(/\s+/g, '_');
      if (sizeOptions.some((s: any) => s.id === cleanId)) {
        setAdminError(`Size ID "${cleanId}" already exists.`);
        return;
      }
      const newSz = {
        id: cleanId,
        name: newSizeName.trim(),
        lengthInches: parseFloat(newSizeLength) || 8,
        basePrice: parseFloat(newSizePrice) || 11.00,
        description: newSizeDescription.trim(),
        displayLabel: newSizeLabel.trim() || `${newSizeName.trim()} (${newSizeLength} inch)`
      };
      const updatedSizes = [...sizeOptions, newSz];
      setSizeOptions(updatedSizes);
      const success = await saveDatabase({ sizeOptions: updatedSizes });
      if (success) {
        setAdminSuccess('Pad Size added successfully!');
        resetAddFormStates();
      }
    }
    else if (activeAddType === 'faq') {
      if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) {
        setAdminError('Question and Answer are required.');
        return;
      }
      const newF = {
        question: newFaqQuestion.trim(),
        answer: newFaqAnswer.trim()
      };
      const updatedFaqs = [...washingFaq, newF];
      setWashingFaq(updatedFaqs);
      const success = await saveDatabase({ washingFaq: updatedFaqs });
      if (success) {
        setAdminSuccess('FAQ Question added successfully!');
        resetAddFormStates();
      }
    }
    else if (activeAddType === 'blog') {
      if (!newBlogTitle.trim() || !newBlogContent.trim()) {
        setAdminError('Blog Title and Content are required.');
        return;
      }
      const computedId = 'blog-' + Date.now();
      const newB = {
        id: computedId,
        title: newBlogTitle.trim(),
        content: newBlogContent.trim(),
        imageUrl: newBlogImageUrl.trim() || 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&q=80&w=400',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        author: newBlogAuthor.trim() || 'WonderPads'
      };
      const updatedBlogs = [...blogPosts, newB];
      setBlogPosts(updatedBlogs);
      const success = await saveDatabase({ blogPosts: updatedBlogs });
      if (success) {
        setAdminSuccess('Blog Post added successfully!');
        resetAddFormStates();
      }
    }
  };

  const startEditingUnifiedItem = (type: 'fabric' | 'pad' | 'size' | 'faq' | 'blog', item: any) => {
    setAdminError('');
    setAdminSuccess('');
    setAdminEditingItem({ type, data: item });

    if (type === 'fabric') {
      setNewFabName(item.name || '');
      setNewFabCategory(item.type === 'backing' ? 'Backing Fabric' : (item.category || 'Flowers'));
      setNewFabMaterial(item.material || '');
      setNewFabPremium((item.premium || 0).toString());
      setNewFabProperties((item.properties || []).join(', '));
      setNewFabStock(item.stockStatus || 'in_stock');
      setNewFabImageUrl(item.imageUrl || '');
    }
    else if (type === 'pad') {
      setNewRtsName(item.name || '');
      setNewRtsDescription(item.description || '');
      setNewRtsPrice((item.price || 15.00).toString());
      setNewRtsSize(item.size || '8 inch');
      setNewRtsPrint(item.print || '');
      setNewRtsAbsorbency(item.absorbency || 'Moderate dry');
      setNewRtsQuantity((item.quantityLeft || 1).toString());
      setNewRtsImageUrl(item.imageUrl || '');
      setNewRtsNotes(item.adminNotes || '');
    }
    else if (type === 'size') {
      setNewSizeId(item.id || '');
      setNewSizeName(item.name || '');
      setNewSizeLabel(item.displayLabel || '');
      setNewSizeLength((item.lengthInches || 8).toString());
      setNewSizePrice((item.basePrice || 11.00).toString());
      setNewSizeDescription(item.description || '');
    }
    else if (type === 'faq') {
      setNewFaqQuestion(item.question || '');
      setNewFaqAnswer(item.answer || '');
    }
    else if (type === 'blog') {
      setNewBlogTitle(item.title || '');
      setNewBlogContent(item.content || '');
      setNewBlogImageUrl(item.imageUrl || '');
      setNewBlogAuthor(item.author || 'WonderPads');
    }
  };

  const handleSaveUnifiedEdit = async () => {
    if (!adminEditingItem) return;
    setAdminError('');
    setAdminSuccess('');
    const { type, data } = adminEditingItem;

    if (type === 'fabric') {
      if (!newFabName.trim()) {
        setAdminError('Fabric print name is required.');
        return;
      }
      const isBacking = newFabCategory === 'Backing Fabric';
      const updatedFab = {
        ...data,
        name: newFabName.trim(),
        type: isBacking ? 'backing' : 'top',
        material: newFabMaterial.trim() || 'Cotton Woven',
        imageUrl: newFabImageUrl.trim() || data.imageUrl,
        premium: parseFloat(newFabPremium) || 0,
        properties: newFabProperties.split(',').map((s: string) => s.trim()).filter(Boolean),
        stockStatus: newFabStock,
        category: isBacking ? 'Backing Fabric' : newFabCategory
      };

      let updatedTop = fabricsTop.filter(x => x.id !== data.id);
      let updatedBacking = fabricsBacking.filter(x => x.id !== data.id);

      if (updatedFab.type === 'top') {
        updatedTop.push(updatedFab);
      } else {
        updatedBacking.push(updatedFab);
      }

      setFabricsTop(updatedTop);
      setFabricsBacking(updatedBacking);

      const success = await saveDatabase({ fabricsTop: updatedTop, fabricsBacking: updatedBacking });
      if (success) {
        setAdminSuccess('Fabric print updated successfully!');
        setAdminEditingItem(null);
        resetAddFormStates();
      }
    }
    else if (type === 'pad') {
      if (!newRtsAbsorbency) {
        setAdminError('Product Type is required.');
        return;
      }
      const calculatedName = RTS_NAME_MAP[newRtsAbsorbency] || newRtsAbsorbency;
      const updatedRtsItem = {
        ...data,
        name: calculatedName,
        description: newRtsDescription.trim(),
        price: parseFloat(newRtsPrice) || 15.00,
        quantityLeft: parseInt(newRtsQuantity) || 1,
        size: newRtsSize || '8 inch',
        sizeLabel: newRtsSize || '8 inch',
        print: newRtsPrint.trim(),
        printLabel: newRtsPrint.trim(),
        absorbency: newRtsAbsorbency,
        absorbencyLabel: newRtsAbsorbency,
        imageUrl: newRtsImageUrl.trim() || data.imageUrl,
        adminNotes: newRtsNotes.trim()
      };

      const updatedList = readyMadeStocks.map(x => x.id === data.id ? updatedRtsItem : x);
      setReadyMadeStocks(updatedList);

      const success = await saveDatabase({ readyMadeStocks: updatedList });
      if (success) {
        setAdminSuccess('Ready-Made Pad updated successfully!');
        setAdminEditingItem(null);
        resetAddFormStates();
      }
    }
    else if (type === 'size') {
      if (!newSizeName.trim()) {
        setAdminError('Size name is required.');
        return;
      }
      const updatedSizeItem = {
        ...data,
        name: newSizeName.trim(),
        lengthInches: parseFloat(newSizeLength) || 8,
        basePrice: parseFloat(newSizePrice) || 11.00,
        description: newSizeDescription.trim(),
        displayLabel: newSizeLabel.trim() || `${newSizeName.trim()} (${newSizeLength} inch)`
      };

      const updatedList = sizeOptions.map(x => x.id === data.id ? updatedSizeItem : x);
      setSizeOptions(updatedList);

      const success = await saveDatabase({ sizeOptions: updatedList });
      if (success) {
        setAdminSuccess('Pad Size updated successfully!');
        setAdminEditingItem(null);
        resetAddFormStates();
      }
    }
    else if (type === 'faq') {
      if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) {
        setAdminError('Question and Answer are required.');
        return;
      }
      const updatedFaqItem = {
        question: newFaqQuestion.trim(),
        answer: newFaqAnswer.trim()
      };

      const updatedList = washingFaq.map(x => x.question === data.question ? updatedFaqItem : x);
      setWashingFaq(updatedList);

      const success = await saveDatabase({ washingFaq: updatedList });
      if (success) {
        setAdminSuccess('FAQ updated successfully!');
        setAdminEditingItem(null);
        resetAddFormStates();
      }
    }
    else if (type === 'blog') {
      if (!newBlogTitle.trim() || !newBlogContent.trim()) {
        setAdminError('Blog Title and Content are required.');
        return;
      }
      const updatedBlogItem = {
        ...data,
        title: newBlogTitle.trim(),
        content: newBlogContent.trim(),
        imageUrl: newBlogImageUrl.trim() || data.imageUrl,
        author: newBlogAuthor.trim() || 'WonderPads'
      };

      const updatedList = blogPosts.map(x => x.id === data.id ? updatedBlogItem : x);
      setBlogPosts(updatedList);

      const success = await saveDatabase({ blogPosts: updatedList });
      if (success) {
        setAdminSuccess('Blog Post updated successfully!');
        setAdminEditingItem(null);
        resetAddFormStates();
      }
    }
  };

  const handleDeleteUnifiedItem = async (type: 'fabric' | 'pad' | 'size' | 'faq' | 'blog', item: any) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    setAdminError('');
    setAdminSuccess('');

    if (type === 'fabric') {
      const updatedTop = fabricsTop.filter(x => x.id !== item.id);
      const updatedBacking = fabricsBacking.filter(x => x.id !== item.id);
      setFabricsTop(updatedTop);
      setFabricsBacking(updatedBacking);
      await saveDatabase({ fabricsTop: updatedTop, fabricsBacking: updatedBacking });
      setAdminSuccess('Fabric print deleted successfully.');
    }
    else if (type === 'pad') {
      const updatedList = readyMadeStocks.filter(x => x.id !== item.id);
      setReadyMadeStocks(updatedList);
      await saveDatabase({ readyMadeStocks: updatedList });
      setAdminSuccess('Ready-Made Pad deleted successfully.');
    }
    else if (type === 'size') {
      const updatedList = sizeOptions.filter(x => x.id !== item.id);
      setSizeOptions(updatedList);
      await saveDatabase({ sizeOptions: updatedList });
      setAdminSuccess('Pad Size deleted successfully.');
    }
    else if (type === 'faq') {
      const updatedList = washingFaq.filter(x => x.question !== item.question);
      setWashingFaq(updatedList);
      await saveDatabase({ washingFaq: updatedList });
      setAdminSuccess('FAQ Question deleted successfully.');
    }
    else if (type === 'blog') {
      const updatedList = blogPosts.filter(x => x.id !== item.id);
      setBlogPosts(updatedList);
      await saveDatabase({ blogPosts: updatedList });
      setAdminSuccess('Blog Post deleted successfully.');
    }
  };

  const currentFormType = adminEditingItem ? adminEditingItem.type : activeAddType;

  return (
    <div className="space-y-4 flex-1 flex flex-col min-h-0 text-zinc-950 font-sans">
      {/* 1. Header Navigation Controller */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 border-b border-zinc-200 pb-3 flex-none">
        <div className="flex flex-1 sm:flex-initial gap-2">
          <button
            type="button"
            onClick={() => {
              setAdminView('add');
              setAdminEditingItem(null);
              setAdminError('');
              setAdminSuccess('');
            }}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
              adminView === 'add' && !adminEditingItem
                ? 'bg-zinc-900 text-white shadow-md'
                : 'bg-white text-zinc-700 border border-zinc-250 hover:bg-zinc-50'
            }`}
          >
            <span>➕</span> Add Something New
          </button>
          <button
            type="button"
            onClick={() => {
              setAdminView('edit');
              setAdminEditingItem(null);
              setAdminError('');
              setAdminSuccess('');
            }}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
              adminView === 'edit' && !adminEditingItem
                ? 'bg-zinc-900 text-white shadow-md'
                : 'bg-white text-zinc-700 border border-zinc-250 hover:bg-zinc-50'
            }`}
          >
            <span>✏️</span> Edit What I Already Have
          </button>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setAdminView('settings');
              setAdminEditingItem(null);
              setAdminError('');
              setAdminSuccess('');
            }}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-[10.5px] uppercase tracking-wider transition-all cursor-pointer ${
              adminView === 'settings'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'bg-zinc-100 text-zinc-600 border border-zinc-200 hover:bg-zinc-200 hover:text-zinc-800'
            }`}
          >
            <span>⚙️</span> Store Settings
          </button>
          
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-[10.5px] uppercase tracking-wider bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all cursor-pointer"
            >
              🚪 Exit Studio Back Office
            </button>
          )}
        </div>
      </div>

      {/* 2. Feedback Panel */}
      {adminSuccess && (
        <div className="text-[10.5px] text-emerald-700 bg-emerald-50 border border-emerald-150 p-2.5 rounded-xl font-bold animate-fadeIn text-left flex-none">
          {adminSuccess}
        </div>
      )}
      {adminError && (
        <div className="text-[10.5px] text-rose-700 bg-rose-50 border border-rose-150 p-2.5 rounded-xl font-semibold text-left flex-none">
          {adminError}
        </div>
      )}

      {/* 3. SCROLLABLE CONTAINER FOR SECTIONS */}
      <div className="space-y-5 overflow-y-auto max-h-[74vh] pr-1 scroll-smooth custom-scrollbar flex-1">
        
        {/* VIEW A: ADD OR EDITING FORM CONTAINER */}
        {((adminView === 'add') || adminEditingItem) && (
          <div className="space-y-4">
            
            {/* 5 Easy Option Selection Grid (Only shown when not editing) */}
            {!adminEditingItem && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pb-2 border-b border-zinc-150">
                {[
                  { id: 'fabric', label: 'My Fabric Prints', emoji: '🧵' },
                  { id: 'pad', label: 'Ready-Made Pads', emoji: '📦' },
                  { id: 'size', label: 'Pad Sizes', emoji: '📏' },
                  { id: 'faq', label: 'FAQ Question', emoji: '❓' },
                  { id: 'blog', label: 'Blog Post', emoji: '📝' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setActiveAddType(opt.id as any);
                      setAdminError('');
                      setAdminSuccess('');
                      resetAddFormStates();
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      activeAddType === opt.id
                        ? 'bg-brand-moss/10 border-brand-moss text-brand-moss font-black scale-102 shadow-3xs'
                        : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300'
                    }`}
                  >
                    <span className="text-xl mb-1">{opt.emoji}</span>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold leading-tight">{opt.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Interactive Single Form Box */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-5 md:p-6 shadow-3xs text-left space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
                <h4 className="text-[11.5px] font-black uppercase text-zinc-850 tracking-wider">
                  {adminEditingItem 
                    ? `✏️ Edit Existing ${adminEditingItem.type === 'fabric' ? 'Fabric Print' : adminEditingItem.type === 'pad' ? 'Ready-Made Pad' : adminEditingItem.type === 'size' ? 'Pad Size' : adminEditingItem.type === 'faq' ? 'FAQ Question' : 'Blog Post'}`
                    : `➕ Add a New ${activeAddType === 'fabric' ? 'Fabric Print' : activeAddType === 'pad' ? 'Ready-Made Pad' : activeAddType === 'size' ? 'Pad Size' : activeAddType === 'faq' ? 'FAQ Question' : 'Blog Post'}`
                  }
                </h4>
                {adminEditingItem && (
                  <button
                    type="button"
                    onClick={() => {
                      setAdminEditingItem(null);
                      resetAddFormStates();
                    }}
                    className="text-[10px] text-zinc-500 hover:text-zinc-800 underline font-bold cursor-pointer"
                  >
                    Cancel Editing
                  </button>
                )}
              </div>

              {/* FORM A: FABRICS */}
              {currentFormType === 'fabric' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-extrabold uppercase">Print Name</label>
                      <input
                        type="text"
                        placeholder="e.g., Sunglow Floral, Sage Meadow..."
                        value={newFabName}
                        onChange={(e) => setNewFabName(e.target.value)}
                        className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:outline-none focus:bg-white focus:ring-1 focus:ring-zinc-400 font-sans font-medium text-zinc-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-extrabold uppercase">Fabric Category</label>
                      <select
                        value={newFabCategory}
                        onChange={(e) => setNewFabCategory(e.target.value)}
                        className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:outline-none focus:bg-white focus:ring-1 focus:ring-zinc-400 font-sans font-medium text-zinc-800"
                      >
                        {categories.map((cat: string) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                        <option value="Backing Fabric">Backing Fabric (Hidden from customization selector)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-extrabold uppercase">Fabric Material Type</label>
                      <input
                        type="text"
                        placeholder="e.g., Cotton Woven, Organic Minky..."
                        value={newFabMaterial}
                        onChange={(e) => setNewFabMaterial(e.target.value)}
                        className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:outline-none focus:bg-white font-sans font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-extrabold uppercase">Premium Price Extra (S$)</label>
                      <input
                        type="text"
                        placeholder="e.g., 0.00, 2.50..."
                        value={newFabPremium}
                        onChange={(e) => setNewFabPremium(e.target.value)}
                        className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:outline-none focus:bg-white font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-extrabold uppercase">Stock Status</label>
                      <select
                        value={newFabStock}
                        onChange={(e) => setNewFabStock(e.target.value as any)}
                        className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:outline-none focus:bg-white font-sans font-medium text-zinc-800"
                      >
                        <option value="in_stock">🟢 In Stock (Ready to Craft)</option>
                        <option value="low_stock">Low Stock (Hurry up)</option>
                        <option value="out_of_stock">Sold Out (Unavailable)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-extrabold uppercase">Fabric Keyword Tags (comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g., florals, pastels, vintage, organic..."
                      value={newFabProperties}
                      onChange={(e) => setNewFabProperties(e.target.value)}
                      className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:outline-none focus:bg-white font-sans"
                    />
                  </div>

                  {/* Image field with R2 selection upload */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-extrabold uppercase block">Photo / Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Paste image URL here, or upload one below..."
                        value={newFabImageUrl}
                        onChange={(e) => setNewFabImageUrl(e.target.value)}
                        className="flex-1 p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:outline-none focus:bg-white font-mono text-zinc-650"
                      />
                      <label className="bg-[#7D8F7D] hover:bg-[#6C7E6C] text-white text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-3xs transition-all active:scale-97">
                        {isUploadingFab ? '...' : '📁 Upload Photo'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={isUploadingFab}
                          onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                              try {
                                setIsUploadingFab(true);
                                const url = await handleUploadToR2(e.target.files[0]);
                                setNewFabImageUrl(url);
                                setAdminSuccess('Uploaded to library successfully!');
                                setTimeout(() => setAdminSuccess(''), 2000);
                              } catch (err: any) {
                                setAdminError('Upload failed: ' + err.message);
                              } finally {
                                setIsUploadingFab(false);
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Advanced Lookbook bulk select options collapsed */}
                  <div className="border-t border-zinc-100 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowAdvancedImport(!showAdvancedImport)}
                      className="text-[10px] text-zinc-500 hover:text-zinc-800 flex items-center gap-1 transition-colors focus:outline-none font-bold"
                    >
                      <span>{showAdvancedImport ? '▼' : '▶'}</span> Show Lookbook Selection Tool (Advanced)
                    </button>

                    {showAdvancedImport && (
                      <div className="mt-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-3 animate-fadeIn">
                        <h5 className="text-[9.5px] font-black uppercase text-zinc-800 tracking-wider">Add Photos from My Workshop Library</h5>
                        <p className="text-[9px] text-zinc-500 leading-relaxed font-medium">
                          Quickly assign an image from your live Cloudflare R2 media library below.
                        </p>

                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              setIsLoadingPhotos(true);
                              const res = await fetch('/api/lookbook');
                              if (res.ok) {
                                const data = await res.json();
                                setLookbookPhotos(data);
                                setAdminSuccess('Workshop library refreshed successfully!');
                              } else {
                                throw new Error('Unreachable library service');
                              }
                            } catch (e: any) {
                              setAdminError(e.message);
                            } finally {
                              setIsLoadingPhotos(false);
                            }
                          }}
                          className="w-full bg-zinc-900 text-white text-[9.5px] font-black tracking-widest uppercase py-2 rounded-lg hover:bg-zinc-800 shadow-3xs cursor-pointer"
                        >
                          🔄 Fetch Workshop Media Gallery
                        </button>

                        {lookbookPhotos.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-[160px] overflow-y-auto p-1 bg-zinc-100 rounded-lg custom-scrollbar">
                            {lookbookPhotos.map((photo: any) => (
                              <div 
                                key={photo.filename} 
                                className="bg-white rounded-lg border border-zinc-200 overflow-hidden text-center text-[8.5px] leading-tight flex flex-col justify-between"
                              >
                                <img 
                                  src={photo.url} 
                                  alt={photo.filename} 
                                  className="h-14 w-full object-cover" 
                                  referrerPolicy="no-referrer"
                                />
                                <div className="p-1">
                                  <p className="truncate font-mono text-zinc-500">{photo.filename}</p>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setNewFabImageUrl(photo.url);
                                      if (!newFabName.trim()) {
                                        setNewFabName(photo.filename.split('.')[0].replace(/[-_]+/g, ' '));
                                      }
                                      setAdminSuccess(`Selected "${photo.filename}" successfully.`);
                                    }}
                                    className="mt-1 w-full bg-emerald-50 text-emerald-700 text-[8px] font-extrabold py-0.5 rounded border border-emerald-100 hover:bg-emerald-100 transition-colors"
                                  >
                                    Assign
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* FORM B: READY-MADE PADS */}
              {currentFormType === 'pad' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-extrabold uppercase">Product Type (Absorbency Tier)</label>
                      <select
                        value={newRtsAbsorbency}
                        onChange={(e) => {
                          setNewRtsAbsorbency(e.target.value);
                          const label = RTS_NAME_MAP[e.target.value] || e.target.value;
                          setNewRtsName(label);
                        }}
                        className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:outline-none focus:bg-white font-sans text-zinc-800 font-medium"
                      >
                        {absorbencyOptions.map((opt: any) => (
                          <option key={opt.id} value={opt.name}>{opt.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-extrabold uppercase font-sans">Product Category Name</label>
                      <input
                        type="text"
                        disabled
                        value={newRtsName || RTS_NAME_MAP[newRtsAbsorbency] || newRtsAbsorbency}
                        className="w-full p-2.5 text-xs border border-zinc-200 rounded-xl bg-zinc-100 text-zinc-500 font-sans font-bold cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1 col-span-2">
                      <label className="text-[10px] text-zinc-500 font-extrabold uppercase">Print Selection Name</label>
                      <input
                        type="text"
                        placeholder="e.g., Sunglow, Fox & Ferns..."
                        value={newRtsPrint}
                        onChange={(e) => setNewRtsPrint(e.target.value)}
                        className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:outline-none focus:bg-white font-sans font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-extrabold uppercase">Price (S$)</label>
                      <input
                        type="text"
                        placeholder="e.g., 15.00..."
                        value={newRtsPrice}
                        onChange={(e) => setNewRtsPrice(e.target.value)}
                        className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:outline-none focus:bg-white font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-extrabold uppercase">Stock Quantity</label>
                      <input
                        type="number"
                        placeholder="e.g., 1..."
                        value={newRtsQuantity}
                        onChange={(e) => setNewRtsQuantity(e.target.value)}
                        className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:outline-none focus:bg-white font-sans text-center font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-extrabold uppercase">Length / Size Selection</label>
                      <select
                        value={newRtsSize}
                        onChange={(e) => setNewRtsSize(e.target.value)}
                        className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:outline-none focus:bg-white text-zinc-800 font-medium font-sans"
                      >
                        {sizeOptions.map((opt: any) => (
                          <option key={opt.id} value={opt.displayLabel}>{opt.displayLabel}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-extrabold uppercase">Short Description (For Shoppers)</label>
                      <input
                        type="text"
                        placeholder="e.g., Ultra-dry fabric lining, handmade..."
                        value={newRtsDescription}
                        onChange={(e) => setNewRtsDescription(e.target.value)}
                        className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:outline-none focus:bg-white font-sans text-zinc-700 font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-extrabold uppercase">Internal Notes (Private)</label>
                    <textarea
                      rows={2}
                      placeholder="Storage shelves, specific flaws, personalized backing selections..."
                      value={newRtsNotes}
                      onChange={(e) => setNewRtsNotes(e.target.value)}
                      className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:outline-none focus:bg-white font-sans text-zinc-700 resize-none leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-extrabold uppercase block">Photo / Image</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Paste image URL, or upload from phone..."
                        value={newRtsImageUrl}
                        onChange={(e) => setNewRtsImageUrl(e.target.value)}
                        className="flex-1 p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:outline-none focus:bg-white font-mono text-zinc-650"
                      />
                      <label className="bg-[#7D8F7D] hover:bg-[#6C7E6C] text-white text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-3xs transition-all active:scale-97">
                        {isUploadingRts ? '...' : '📁 Upload Photo'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={isUploadingRts}
                          onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                              try {
                                setIsUploadingRts(true);
                                const url = await handleUploadToR2(e.target.files[0]);
                                setNewRtsImageUrl(url);
                                setAdminSuccess('Uploaded to library successfully!');
                                setTimeout(() => setAdminSuccess(''), 2000);
                              } catch (err: any) {
                                setAdminError('Upload failed: ' + err.message);
                              } finally {
                                setIsUploadingRts(false);
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* RTS Bulk Import tools collapsed */}
                  <div className="border-t border-zinc-100 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowAdvancedImport(!showAdvancedImport)}
                      className="text-[10px] text-zinc-500 hover:text-zinc-800 flex items-center gap-1 transition-colors focus:outline-none font-bold"
                    >
                      <span>{showAdvancedImport ? '▼' : '▶'}</span> Show Bulk Import Tools (Advanced)
                    </button>

                    {showAdvancedImport && (
                      <div className="mt-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-3 animate-fadeIn">
                        <h5 className="text-[9.5px] font-black uppercase text-zinc-800 tracking-wider">Advanced Import Tools</h5>
                        <p className="text-[9px] text-zinc-500 leading-normal font-medium">
                          Quickly create multiple ready-made pads at once matching lookbook folders.
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="space-y-0.5">
                            <label className="text-[8px] text-zinc-500 font-extrabold uppercase">R2 Folder Keyword Filter</label>
                            <input 
                              type="text" 
                              value={rtsBulkImportTag} 
                              onChange={(e) => setRtsBulkImportTag(e.target.value)}
                              className="w-full p-2 text-xs border border-zinc-250 rounded-lg bg-white"
                            />
                          </div>
                          <div className="space-y-0.5">
                            <label className="text-[8px] text-zinc-500 font-extrabold uppercase">Set Shop Category</label>
                            <select 
                              value={categories[0] || ''}
                              className="w-full p-2 text-xs border border-zinc-250 rounded-lg bg-white"
                            >
                              {categories.map((c: string) => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={isRtsBulkImporting}
                          onClick={async () => {
                            try {
                              setIsRtsBulkImporting(true);
                              const response = await fetch('/api/lookbook');
                              if (response.ok) {
                                const photos = await response.json();
                                const filtered = photos.filter((p: any) => p.filename.toLowerCase().includes(rtsBulkImportTag.toLowerCase()));
                                if (filtered.length === 0) {
                                  alert(`No lookbook photos found matching the folder name keyword "${rtsBulkImportTag}".`);
                                  return;
                                }
                                
                                const importedPads = filtered.map((p: any, index: number) => ({
                                  id: 'rts-' + Date.now() + '-' + index,
                                  name: RTS_NAME_MAP['Moderate dry'] || 'Moderate Day Pad',
                                  description: 'Pre-crafted limited release pack ready for immediate dispatch',
                                  price: 15.00,
                                  quantityLeft: 1,
                                  size: 'Regular Day (8")',
                                  sizeLabel: 'Regular Day (8")',
                                  print: p.filename.split('.')[0].replace(/[-_]+/g, ' '),
                                  printLabel: p.filename.split('.')[0].replace(/[-_]+/g, ' '),
                                  absorbency: 'Moderate dry',
                                  absorbencyLabel: 'Moderate dry',
                                  imageUrl: p.url,
                                  adminNotes: 'Bulk imported from lookbook folder',
                                  hidden: false
                                }));

                                const newList = [...readyMadeStocks, ...importedPads];
                                setReadyMadeStocks(newList);
                                const success = await saveDatabase({ readyMadeStocks: newList });
                                if (success) {
                                  setAdminSuccess(`Successfully bulk-imported ${importedPads.length} ready-made pads!`);
                                  setShowAdvancedImport(false);
                                }
                              }
                            } catch (err: any) {
                              setAdminError('Bulk import failed: ' + err.message);
                            } finally {
                              setIsRtsBulkImporting(false);
                            }
                          }}
                          className="w-full bg-[#7D8F7D] hover:bg-[#6C7E6C] text-white font-bold text-[9.5px] uppercase tracking-wider py-2 rounded-lg active:scale-97 transition-all shadow-3xs"
                        >
                          {isRtsBulkImporting ? 'Syncing...' : '🚀 Bulk Create Batch'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* FORM C: PAD SIZES */}
              {currentFormType === 'size' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-extrabold uppercase">Unique Size ID (Letters/Underscores Only)</label>
                      <input
                        type="text"
                        placeholder="e.g., mini_liner, night_heavy (cannot be changed once saved)..."
                        disabled={adminEditingItem !== null}
                        value={newSizeId}
                        onChange={(e) => setNewSizeId(e.target.value)}
                        className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:outline-none focus:bg-white disabled:bg-zinc-100 disabled:text-zinc-500 font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-extrabold uppercase">Short Name</label>
                      <input
                        type="text"
                        placeholder="e.g., Liner, Heavy..."
                        value={newSizeName}
                        onChange={(e) => setNewSizeName(e.target.value)}
                        className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:outline-none focus:bg-white font-sans text-zinc-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-extrabold uppercase">Length (inches)</label>
                      <input
                        type="text"
                        placeholder="e.g., 6, 8, 10, 12..."
                        value={newSizeLength}
                        onChange={(e) => setNewSizeLength(e.target.value)}
                        className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:outline-none focus:bg-white font-sans"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-extrabold uppercase">Base Price (S$)</label>
                      <input
                        type="text"
                        placeholder="e.g., 11.00..."
                        value={newSizePrice}
                        onChange={(e) => setNewSizePrice(e.target.value)}
                        className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:outline-none focus:bg-white font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-extrabold uppercase font-sans">Full Display Label</label>
                      <input
                        type="text"
                        placeholder="e.g., Mini Pantyliner (6&quot;)"
                        value={newSizeLabel}
                        onChange={(e) => setNewSizeLabel(e.target.value)}
                        className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:outline-none focus:bg-white font-sans"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-extrabold uppercase">Length / Width Description</label>
                    <input
                      type="text"
                      placeholder="e.g., Slim 2&quot; snapped width, perfect for light spots..."
                      value={newSizeDescription}
                      onChange={(e) => setNewSizeDescription(e.target.value)}
                      className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:outline-none focus:bg-white font-sans"
                    />
                  </div>
                </div>
              )}

              {/* FORM D: FAQ QUESTIONS */}
              {currentFormType === 'faq' && (
                <div className="space-y-4">
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] text-zinc-500 font-extrabold uppercase">FAQ Question Text</label>
                    <input
                      type="text"
                      placeholder="e.g., How do I prep my new cloth pad before the first use?"
                      value={newFaqQuestion}
                      onChange={(e) => setNewFaqQuestion(e.target.value)}
                      className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:outline-none focus:bg-white font-sans text-zinc-800 font-bold"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[10px] text-zinc-500 font-extrabold uppercase">Detailed Answer</label>
                    <textarea
                      rows={5}
                      placeholder="Provide care tips, soaking instructions, prep advice..."
                      value={newFaqAnswer}
                      onChange={(e) => setNewFaqAnswer(e.target.value)}
                      className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:outline-none focus:bg-white font-sans text-zinc-700 leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* FORM E: BLOG POSTS */}
              {currentFormType === 'blog' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] text-zinc-500 font-extrabold uppercase">Blog Title</label>
                      <input
                        type="text"
                        placeholder="e.g., Cloth Pads Washing Guide 101..."
                        value={newBlogTitle}
                        onChange={(e) => setNewBlogTitle(e.target.value)}
                        className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:outline-none focus:bg-white font-sans text-zinc-800 font-bold"
                      />
                    </div>
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] text-zinc-500 font-extrabold uppercase">Author Display Name</label>
                      <input
                        type="text"
                        placeholder="WonderPads"
                        value={newBlogAuthor}
                        onChange={(e) => setNewBlogAuthor(e.target.value)}
                        className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:outline-none focus:bg-white font-sans font-medium text-zinc-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[10px] text-zinc-500 font-extrabold uppercase">Post Content (Markdown or plain text)</label>
                    <textarea
                      rows={8}
                      placeholder="Write your article here..."
                      value={newBlogContent}
                      onChange={(e) => setNewBlogContent(e.target.value)}
                      className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:outline-none focus:bg-white font-sans text-zinc-700 leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-extrabold uppercase block">Hero Photo / Image</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Paste image URL, or upload below..."
                        value={newBlogImageUrl}
                        onChange={(e) => setNewBlogImageUrl(e.target.value)}
                        className="flex-1 p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 focus:outline-none focus:bg-white font-mono text-zinc-650"
                      />
                      <label className="bg-[#7D8F7D] hover:bg-[#6C7E6C] text-white text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-3xs transition-all active:scale-97">
                        {isUploadingBlog ? '...' : '📁 Upload Photo'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={isUploadingBlog}
                          onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                              try {
                                setIsUploadingBlog(true);
                                const url = await handleUploadToR2(e.target.files[0]);
                                setNewBlogImageUrl(url);
                                setAdminSuccess('Uploaded hero image successfully!');
                                setTimeout(() => setAdminSuccess(''), 2000);
                              } catch (err: any) {
                                setAdminError('Upload failed: ' + err.message);
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
              )}

              {/* Form Action Controls */}
              <div className="pt-4 border-t border-zinc-100 flex gap-2 justify-end">
                {adminEditingItem ? (
                  <>
                    <button
                      type="button"
                      onClick={handleSaveUnifiedEdit}
                      className="bg-zinc-900 hover:bg-zinc-800 text-white font-black px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-3xs cursor-pointer active:scale-97"
                    >
                      💾 Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAdminEditingItem(null);
                        resetAddFormStates();
                      }}
                      className="bg-zinc-100 hover:bg-zinc-200 text-zinc-650 font-extrabold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddNewItem}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white font-black px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-3xs cursor-pointer active:scale-97"
                  >
                    ➕ Save & Register Item
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW B: SEARCHABLE COMBINED GALLERY */}
        {adminView === 'edit' && !adminEditingItem && (
          <div className="space-y-4 animate-fadeIn text-left">
            
            {/* Unified Search Input */}
            <div className="relative bg-white p-3 rounded-2xl border border-zinc-200 shadow-3xs">
              <input
                type="text"
                placeholder="🔍 Type keywords to search fabrics, pads, sizes, FAQs, or blogs..."
                value={adminEditSearch}
                onChange={(e) => setAdminEditSearch(e.target.value)}
                className="w-full px-4 py-2 text-xs border border-zinc-250 rounded-xl focus:outline-none focus:bg-zinc-50 transition-all font-sans text-zinc-800 font-medium"
              />
            </div>

            {/* Combined Catalog List */}
            <div className="space-y-2 bg-white border border-zinc-200 rounded-3xl p-4 shadow-3xs max-h-[58vh] overflow-y-auto custom-scrollbar">
              <h4 className="text-[10.5px] font-black uppercase text-zinc-400 tracking-wider mb-2.5 px-1">
                My Active Catalog Preview
              </h4>

              {(() => {
                const query = adminEditSearch.toLowerCase().trim();
                
                // Aggregate all items
                const allItems: { type: 'fabric' | 'pad' | 'size' | 'faq' | 'blog', name: string, sub: string, img: string, original: any }[] = [];
                
                fabricsTop.forEach(x => {
                  allItems.push({ type: 'fabric', name: x.name, sub: `Category: ${x.category || 'Top Print'} • Extra: S$${(x.premium || 0).toFixed(2)} • Stock: ${x.stockStatus || 'in_stock'}`, img: x.imageUrl || '', original: x });
                });
                fabricsBacking.forEach(x => {
                  allItems.push({ type: 'fabric', name: x.name, sub: `Category: Backing Fabric • Extra: S$${(x.premium || 0).toFixed(2)}`, img: x.imageUrl || '', original: x });
                });
                readyMadeStocks.forEach(x => {
                  allItems.push({ type: 'pad', name: `${x.print || 'Ready Pad'} (${x.absorbency || 'Moderate'})`, sub: `Size: ${x.size || '8 inch'} • Price: S$${(x.price || 15).toFixed(2)} • Qty Left: ${x.quantityLeft}`, img: x.imageUrl || '', original: x });
                });
                sizeOptions.forEach(x => {
                  allItems.push({ type: 'size', name: x.displayLabel || x.name, sub: `Size ID: ${x.id} • Base Price: S$${(x.basePrice || 11).toFixed(2)}`, img: '', original: x });
                });
                washingFaq.forEach(x => {
                  allItems.push({ type: 'faq', name: x.question, sub: `Answer: ${x.answer.substring(0, 80)}...`, img: '', original: x });
                });
                blogPosts.forEach(x => {
                  allItems.push({ type: 'blog', name: x.title, sub: `By: ${x.author || 'WonderPads'} • ${x.date}`, img: x.imageUrl || '', original: x });
                });

                // Apply simple search filter
                const filtered = allItems.filter(x => 
                  x.name.toLowerCase().includes(query) || 
                  x.sub.toLowerCase().includes(query) ||
                  x.type.toLowerCase().includes(query)
                );

                if (filtered.length === 0) {
                  return (
                    <div className="py-12 text-center text-zinc-400 font-sans text-xs">
                      No results match "{adminEditSearch}".
                    </div>
                  );
                }

                return (
                  <div className="divide-y divide-zinc-100">
                    {filtered.map((item, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between gap-3 hover:bg-zinc-50/50 px-1.5 rounded-xl transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          {item.img ? (
                            <img 
                              src={item.img} 
                              alt={item.name} 
                              className="h-10 w-10 object-cover rounded-lg border border-zinc-200 shrink-0" 
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="h-10 w-10 bg-zinc-100 rounded-lg border border-zinc-200 flex items-center justify-center shrink-0 text-lg">
                              {item.type === 'size' && '📏'}
                              {item.type === 'faq' && '❓'}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <h5 className="text-[11px] font-bold text-zinc-800 truncate leading-tight">
                                {item.name}
                              </h5>
                              <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full shrink-0 ${
                                item.type === 'fabric' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                                item.type === 'pad' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                item.type === 'size' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                item.type === 'faq' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                                'bg-violet-50 text-violet-700 border border-violet-100'
                              }`}>
                                {item.type === 'fabric' && '🧵 My Fabric Print'}
                                {item.type === 'pad' && '📦 Ready-Made'}
                                {item.type === 'size' && '📏 Pad Size'}
                                {item.type === 'faq' && '❓ FAQ Question'}
                                {item.type === 'blog' && '📝 Blog Post'}
                              </span>
                            </div>
                            <p className="text-[9.5px] text-zinc-500 truncate mt-0.5 max-w-[400px]">
                              {item.sub}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => startEditingUnifiedItem(item.type, item.original)}
                            className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-extrabold text-[9.5px] px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteUnifiedItem(item.type, item.original)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-[9.5px] px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* VIEW C: RISKY / RARE STORE SETTINGS PANEL */}
        {adminView === 'settings' && (
          <div className="space-y-4 animate-fadeIn text-left">
            
            {/* 1. Category Management List */}
            <div className="bg-white p-4 rounded-2xl border border-zinc-200 space-y-3 shadow-3xs">
              <h4 className="text-[10.5px] font-black uppercase text-zinc-800 tracking-wider flex items-center gap-1.5">
                <span>📂</span> Edit Shop Categories
              </h4>
              <p className="text-[9.5px] text-zinc-500 leading-normal">
                Organize your print filters. Type one category per line to add, modify, or delete filters.
              </p>
              <textarea
                rows={4}
                value={editingCategoriesText}
                onChange={(e) => setEditingCategoriesText(e.target.value)}
                placeholder="Flowers&#10;Kimmi&#10;Characters"
                className="w-full p-2.5 text-xs border border-zinc-250 rounded-xl bg-zinc-50 font-sans focus:outline-none focus:bg-white leading-relaxed text-zinc-800 font-medium"
              />
              <button
                type="button"
                onClick={async () => {
                  const parsed = editingCategoriesText
                    .split('\n')
                    .map(line => line.trim())
                    .filter(Boolean);
                  if (parsed.length === 0) {
                    setAdminError('You must have at least one active category.');
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
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-2 px-3 rounded-lg text-xs transition-all active:scale-97 cursor-pointer"
              >
                Save Category Lists
              </button>
            </div>

            {/* 2. Order Route Contacts */}
            <div className="bg-white p-4 rounded-2xl border border-zinc-200 space-y-3 shadow-3xs">
              <h4 className="text-[10.5px] font-black uppercase text-zinc-800 tracking-wider flex items-center gap-1.5">
                <span>📧</span> Order Receipt Contacts
              </h4>
              <p className="text-[9.5px] text-zinc-500 leading-normal">
                Direct where customer order requests are routed via Email and WhatsApp.
              </p>
              <div className="space-y-2">
                <div className="space-y-0.5">
                  <label className="text-[8.5px] text-zinc-500 font-extrabold uppercase">Merchant Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. nilam1978@gmail.com"
                    value={merchantEmail}
                    onChange={(e) => setMerchantEmail(e.target.value)}
                    className="w-full p-2 text-xs border border-zinc-250 rounded-lg bg-zinc-50 text-zinc-800 font-medium focus:outline-none"
                  />
                </div>
                <div className="space-y-0.5">
                  <label className="text-[8.5px] text-zinc-500 font-extrabold uppercase">WhatsApp Phone (Country Code First)</label>
                  <input
                    type="text"
                    placeholder="e.g. 6583397556"
                    value={merchantPhone}
                    onChange={(e) => setMerchantPhone(e.target.value)}
                    className="w-full p-2 text-xs border border-zinc-250 rounded-lg bg-zinc-50 text-zinc-800 font-mono focus:outline-none"
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
                  if (success) {
                    setAdminSuccess('Order contact settings saved!');
                  }
                }}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-2 px-3 rounded-lg text-xs transition-all active:scale-97 cursor-pointer"
              >
                Save Contact Routing
              </button>
            </div>

            {/* 3. Shop Logo Settings */}
            <div className="bg-white p-4 rounded-2xl border border-zinc-200 space-y-3 shadow-3xs">
              <h4 className="text-[10.5px] font-black uppercase text-zinc-800 tracking-wider flex items-center gap-1.5">
                <span>🖼️</span> Shop Logo Branding
              </h4>
              <p className="text-[9.5px] text-zinc-500 leading-normal">
                Upload your custom logo to brand your entire storefront customizer.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste URL or upload below..."
                  value={shopLogoUrl}
                  onChange={(e) => setShopLogoUrl(e.target.value)}
                  className="flex-1 p-2 text-xs border border-zinc-250 rounded-lg bg-zinc-50 font-mono focus:outline-none text-zinc-700"
                />
                <label className="bg-[#7D8F7D] hover:bg-[#6C7E6C] text-white text-xs font-bold py-2 px-3 rounded-lg cursor-pointer flex items-center justify-center gap-1 shrink-0 shadow-3xs transition-all">
                  {isUploadingLogo ? '...' : '📁 Upload Logo'}
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
                            settings: {
                              categories,
                              shopLogoUrl: url,
                              merchantEmail,
                              merchantPhone
                            }
                          });
                          setAdminSuccess('Shop branding logo saved successfully!');
                        } catch (err: any) {
                          setAdminError('Logo upload failed: ' + err.message);
                        } finally {
                          setIsUploadingLogo(false);
                        }
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* 4. Password Settings */}
            <div className="bg-white p-4 rounded-2xl border border-zinc-200 space-y-3 shadow-3xs">
              <h4 className="text-[10.5px] font-black uppercase text-zinc-800 tracking-wider flex items-center gap-1.5">
                <span>🔒</span> Update Admin Password
              </h4>
              <div className="space-y-2">
                <input
                  type="password"
                  placeholder="Type new administrative secret..."
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  className="w-full p-2 text-xs border border-zinc-250 rounded-lg bg-zinc-50 focus:outline-none focus:bg-white text-zinc-800"
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
                      setAdminSuccess('Password changed successfully!');
                      setNewAdminPassword('');
                    }
                  }}
                  className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-2 px-3 rounded-lg text-xs transition-all cursor-pointer"
                >
                  Change Password
                </button>
              </div>
            </div>

            {/* 5. Database Backup and recovery JSON */}
            <div className="bg-white p-4 rounded-2xl border border-zinc-200 space-y-3 shadow-3xs">
              <h4 className="text-[10.5px] font-black uppercase text-zinc-800 tracking-wider flex items-center gap-1.5">
                <span>💾</span> Database Backups
              </h4>
              <p className="text-[9.5px] text-zinc-500 leading-normal">
                Export and download all of your current catalog settings as a backup file, or upload a backup file to restore your store.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const databasePayload = {
                      fabricsTop,
                      fabricsBacking,
                      sizeOptions,
                      absorbencyOptions,
                      readyMadeStocks,
                      shapeOptions,
                      washingFaq,
                      blogPosts,
                      settings: {
                        adminPassword: activePassword,
                        categories,
                        shopLogoUrl,
                        merchantEmail,
                        merchantPhone
                      }
                    };
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(databasePayload, null, 2));
                    const downloadAnchor = document.createElement('a');
                    downloadAnchor.setAttribute("href", dataStr);
                    downloadAnchor.setAttribute("download", "customizer-db.json");
                    document.body.appendChild(downloadAnchor);
                    downloadAnchor.click();
                    downloadAnchor.remove();
                    setAdminSuccess('Backup exported successfully!');
                  }}
                  className="w-full bg-[#7D8F7D] hover:bg-[#6C7E6C] text-white font-bold py-2 px-3 rounded-lg text-xs transition-colors shadow-3xs flex items-center justify-center gap-1.5"
                >
                  📥 Export Database Backup
                </button>

                <div className="border-t border-dashed border-zinc-200 pt-2 text-center">
                  <label className="w-full border border-zinc-250 hover:bg-zinc-50 text-zinc-700 text-xs font-bold py-2 px-3 rounded-lg cursor-pointer flex items-center justify-center gap-1.5 transition-colors">
                    <span>📤</span> Restore from Backup File
                    <input
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          const reader = new FileReader();
                          reader.onload = async (event) => {
                            try {
                              const parsed = JSON.parse(event.target?.result as string);
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

                                setAdminSuccess('Database fully restored from backup!');
                              } else {
                                setAdminError('Invalid file structure.');
                              }
                            } catch (err: any) {
                              setAdminError('Parsing error: ' + err.message);
                            }
                          };
                          reader.readAsText(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* 6. GitHub Syncer */}
            <div className="bg-white p-4 rounded-2xl border border-zinc-200 space-y-3 shadow-3xs">
              <h4 className="text-[10.5px] font-black uppercase text-zinc-800 tracking-wider flex items-center gap-1.5">
                <span>🐱</span> GitHub Publishing Sync
              </h4>
              <p className="text-[9.5px] text-zinc-500 leading-normal">
                Synchronize and push your entire offline database and changes back to your GitHub repository.
              </p>

              <details className="group border border-zinc-200 rounded-xl overflow-hidden bg-zinc-50/50">
                <summary className="list-none flex items-center justify-between p-2.5 cursor-pointer text-[10px] font-bold text-zinc-700 hover:bg-zinc-100 select-none transition-colors">
                  <span>⚙️ Repository Sync Config</span>
                  <span className="transition-transform group-open:rotate-180 text-[8px] text-zinc-400">▼</span>
                </summary>
                <div className="p-2.5 border-t border-zinc-150 bg-white space-y-2 text-xs">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-[9px] text-emerald-800 leading-relaxed">
                    🔒 GitHub token is configured server-side (GITHUB_PAT secret) - not stored in the browser.
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[8px] text-zinc-500 font-extrabold uppercase block">Username</label>
                      <input
                        type="text"
                        value={ghOwner}
                        onChange={(e) => {
                          setGhOwner(e.target.value);
                          localStorage.setItem('gh_sync_owner', e.target.value);
                        }}
                        className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-zinc-250 bg-zinc-50"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] text-zinc-500 font-extrabold uppercase block">Repo Name</label>
                      <input
                        type="text"
                        value={ghRepo}
                        onChange={(e) => {
                          setGhRepo(e.target.value);
                          localStorage.setItem('gh_sync_repo', e.target.value);
                        }}
                        className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-zinc-250 bg-zinc-50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[8px] text-zinc-500 font-extrabold uppercase block">Branch</label>
                      <input
                        type="text"
                        value={ghBranch}
                        onChange={(e) => {
                          setGhBranch(e.target.value);
                          localStorage.setItem('gh_sync_branch', e.target.value);
                        }}
                        className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-zinc-250 bg-zinc-50"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] text-zinc-500 font-extrabold uppercase block">Commit Msg</label>
                      <input
                        type="text"
                        value={ghCommitMsg}
                        onChange={(e) => setGhCommitMsg(e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-zinc-250 bg-zinc-50"
                      />
                    </div>
                  </div>
                </div>
              </details>

              <button
                type="button"
                onClick={publishToGithub}
                disabled={isPublishingToGithub}
                className="w-full bg-zinc-900 hover:bg-zinc-850 disabled:bg-zinc-400 text-white font-bold py-2.5 px-3 rounded-lg text-xs transition-colors shadow-3xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isPublishingToGithub ? 'Publishing to GitHub...' : 'Push Database to Live GitHub Repository'}
              </button>
            </div>

            {/* 7. Connection status integrations */}
            <div className="bg-zinc-100 border border-zinc-250 p-3.5 rounded-2xl space-y-2 text-[10px] text-zinc-650 leading-relaxed">
              <h5 className="font-bold text-zinc-850 uppercase text-[9px] tracking-wider">Integrations Connection Board</h5>
              <div>
                <strong>Firebase Cloud Firestore:</strong>{' '}
                {firebaseStatus?.connected ? (
                  <span className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded font-extrabold">🟢 Connected</span>
                ) : (
                  <span className="text-amber-600 bg-amber-50 px-1 py-0.5 rounded font-extrabold">🟡 Fallback Active</span>
                )}
              </div>
              <div>
                <strong>Workshop Media engine:</strong>{' '}
                {isR2Mock ? (
                  <span className="text-amber-600 bg-amber-50 px-1 py-0.5 rounded font-extrabold">🟡 Offline Mock Mode</span>
                ) : (
                  <span className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded font-extrabold">🟢 Live Lookbook Storage</span>
                )}
              </div>
            </div>

            {/* 8. DANGEROUS RESET SECTION AT THE ABSOLUTE BOTTOM */}
            <div className="pt-8 border-t border-dashed border-red-200 text-center space-y-3">
              <h4 className="text-[11px] font-black uppercase text-red-600 tracking-wider">⚠️ Dangerous Store Management</h4>
              <p className="text-[10px] text-zinc-500 max-w-sm mx-auto leading-relaxed">
                Only use this if you want to completely wipe your shop and start from scratch — this cannot be undone.
              </p>

              {showEraseConfirmationModal ? (
                <div className="bg-red-50 border border-red-150 p-4 rounded-2xl max-w-sm mx-auto space-y-3 animate-fadeIn">
                  <p className="text-[10px] text-red-800 font-extrabold leading-normal">
                    To prevent accidents, type the shop name <strong className="font-mono text-xs select-all text-red-900">WonderPads</strong> exactly in the input box below to confirm:
                  </p>
                  <input
                    type="text"
                    placeholder="Type: WonderPads"
                    value={eraseConfirmationInput}
                    onChange={(e) => setEraseConfirmationInput(e.target.value)}
                    className="w-full text-center p-2 text-xs border border-red-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 font-bold bg-white text-zinc-800"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={eraseConfirmationInput !== 'WonderPads'}
                      onClick={async () => {
                        setFabricsTop([]);
                        setFabricsBacking([]);
                        setSizeOptions([]);
                        setAbsorbencyOptions([]);
                        setReadyMadeStocks([]);
                        setWashingFaq([]);
                        setBlogPosts([]);
                        
                        const success = await saveDatabase({
                          fabricsTop: [],
                          fabricsBacking: [],
                          sizeOptions: [],
                          absorbencyOptions: [],
                          readyMadeStocks: [],
                          washingFaq: [],
                          blogPosts: [],
                        });

                        setShowEraseConfirmationModal(false);
                        setEraseConfirmationInput('');
                        if (success) {
                          setAdminSuccess('Shop has been completely wiped. Starting fresh!');
                          setAdminView('add');
                        }
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-zinc-200 disabled:text-zinc-400 text-white font-extrabold py-2 rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      ERASE EVERYTHING
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEraseConfirmationModal(false);
                        setEraseConfirmationInput('');
                      }}
                      className="bg-zinc-200 hover:bg-zinc-250 text-zinc-700 font-extrabold px-3 py-2 rounded-lg text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowEraseConfirmationModal(true)}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-250 font-black text-[10.5px] uppercase tracking-wider px-6 py-3 rounded-2xl transition-all hover:scale-102 cursor-pointer"
                >
                  💣 Erase Everything and Start Over
                </button>
              )}
            </div>

          </div>
        )}

        {/* Unified Sign Out Session button */}
        <button
          type="button"
          onClick={() => {
            setIsAdminAuthenticated(false);
            setAdminPasswordInput('');
            localStorage.removeItem('admin_session_auth');
            setAdminSuccess('Signed out successfully.');
            setTimeout(() => setAdminSuccess(''), 2000);
          }}
          className="w-full bg-zinc-150 hover:bg-zinc-200 text-zinc-600 font-black py-2.5 rounded-xl text-xs transition-colors uppercase tracking-wider"
        >
          Sign Out of Session
        </button>

      </div>
    </div>
  );
};
