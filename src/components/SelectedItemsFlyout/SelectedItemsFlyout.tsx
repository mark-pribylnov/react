import { downloadSelectedItemsCsv } from '../../lib/downloadSelectedItemsCsv';
import {
  clearSelectedItems,
  useAppDispatch,
  useAppSelector,
} from '../../store';
import './SelectedItemsFlyout.scss';

export default function SelectedItemsFlyout() {
  const dispatch = useAppDispatch();
  const selectedItems = useAppSelector((state) => state.selectedItems.items);

  if (selectedItems.length === 0) {
    return null;
  }

  const handleUnselectAll = (): void => {
    dispatch(clearSelectedItems());
  };

  const handleDownload = (): void => {
    downloadSelectedItemsCsv(selectedItems);
  };

  return (
    <aside
      className="selected-items-flyout"
      role="region"
      aria-label="Selected items"
    >
      <p className="selected-items-flyout__count">
        {selectedItems.length} item{selectedItems.length === 1 ? '' : 's'} selected
      </p>
      <div className="selected-items-flyout__actions">
        <button
          type="button"
          className="selected-items-flyout__button"
          onClick={handleUnselectAll}
        >
          Unselect all
        </button>
        <button
          type="button"
          className="selected-items-flyout__button"
          onClick={handleDownload}
        >
          Download
        </button>
      </div>
    </aside>
  );
}
