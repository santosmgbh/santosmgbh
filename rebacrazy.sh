# 1. Get the parameters using message and wait for the user to confirm
# 2. Get the parameters from the command line
# 3. Check if the parameters are valid
# 4. If valid, run the command with the parameters
# 5. the first parameter is the branch that will be the base for the rebase
# 6. the second parameter is the branch that will be rebased
# 7. the third parameters are the commits that will be cherry-picked
#!/bin/bash
# Function to prompt for parameters if not provided
prompt_for_params() {
    read -p "Enter base branch: " base_branch
    read -p "Enter branch to rebase: " rebase_branch
    read -p "Enter commits to cherry-pick (space-separated): " commits
}

# Get parameters from command line or prompt
if [ $# -lt 3 ]; then
    echo "Not enough parameters provided."
    prompt_for_params
else
    base_branch="$1"
    rebase_branch="$2"
    shift 2
    commits="$*"
fi

# Show parameters and confirm
echo "Base branch: $base_branch"
echo "Branch to rebase: $rebase_branch"
echo "Commits to cherry-pick: $commits"
read -p "Proceed with these parameters? (y/n): " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
    echo "Aborted."
    exit 1
fi

# Validate branches
if ! git rev-parse --verify "$base_branch" >/dev/null 2>&1; then
    echo "Base branch '$base_branch' does not exist."
    exit 1
fi
if ! git rev-parse --verify "$rebase_branch" >/dev/null 2>&1; then
    echo "Branch to rebase '$rebase_branch' does not exist."
    exit 1
fi

# Validate commits
for commit in $commits; do
    if ! git cat-file -e "$commit^{commit}" 2>/dev/null; then
        echo "Commit '$commit' does not exist."
        exit 1
    fi
done

# Run the rebase and cherry-pick
git checkout "$base_branch" || exit 1
git branch -D "$rebase_branch" || exit 1
git checkout -b "$rebase_branch" || exit 1
for commit in $commits; do
    git cherry-pick "$commit" || exit 1
done

echo "Rebase and cherry-pick completed successfully."

read -p "Do you want to push '$rebase_branch' to remote? (y/n): " push_confirm
if [[ "$push_confirm" == "y" || "$push_confirm" == "Y" ]]; then
    git push -u origin "$rebase_branch"
    if [ $? -eq 0 ]; then
        echo "Branch '$rebase_branch' pushed to remote."
    else
        echo "Failed to push branch '$rebase_branch' to remote."
    fi
else
    echo "Branch was not pushed to remote."
fi
# End of script
