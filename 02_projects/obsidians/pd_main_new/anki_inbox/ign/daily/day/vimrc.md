inoremap <special> jk <Esc>
set number
syntax on
set hlsearch
set incsearch
set expandtab
set tabstop=4
set shiftwidth=4

call plug#begin('~/.vim/plugged')
" Установка плагина NERDTree
Plug 'preservim/nerdtree'
call plug#end()

"map <C-n> :NERDTreeToggle<CR>
nnoremap <C-n> :NERDTreeToggle<CR>
"map  <C-n>  <Esc>:NERDTreeToggle<CR>
